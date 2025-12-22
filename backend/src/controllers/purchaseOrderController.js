const PurchaseOrder = require("../models/PurchaseOrder");
const Material = require("../models/Material");

// Helper function to update material stock
async function updateMaterialStock(materialId, quantity, operation) {
  const material = await Material.findById(materialId);
  if (!material) return;

  if (operation === "add") {
    material.stockQuantity += quantity;
  } else if (operation === "subtract") {
    material.stockQuantity = Math.max(0, material.stockQuantity - quantity);
  }

  await material.save();
}

exports.getAllPurchaseOrders = async (req, res, next) => {
  try {
    const { search, dateFrom, dateTo, supplierId } = req.query;
    let query = {};

    if (search) {
      query.orderNumber = { $regex: search, $options: "i" };
    }
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (supplierId) {
      query.supplierId = supplierId;
    }

    const orders = await PurchaseOrder.find(query)
      .populate("supplierId", "name")
      .populate("materials.materialId", "name code")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getPurchaseOrderById = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate("supplierId")
      .populate("materials.materialId");
    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.createPurchaseOrder = async (req, res, next) => {
  try {
    const { materials, ...orderData } = req.body;

    // Calculate line totals and order total
    const materialsWithTotals = materials.map((material) => ({
      ...material,
      total: material.quantity * material.unitCost,
    }));

    const totalAmount = materialsWithTotals.reduce((sum, mat) => sum + mat.total, 0);

    const order = new PurchaseOrder({
      ...orderData,
      materials: materialsWithTotals,
      totalAmount,
    });

    await order.save();

    // Update material stock if status is Completed
    if (order.status === "Completed") {
      for (const material of materialsWithTotals) {
        await updateMaterialStock(material.materialId, material.quantity, "add");
      }
    }

    await order.populate("supplierId", "name");
    await order.populate("materials.materialId", "name code");

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updatePurchaseOrder = async (req, res, next) => {
  try {
    const existingOrder = await PurchaseOrder.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    const { materials, ...orderData } = req.body;

    // Calculate totals if materials are provided
    let materialsWithTotals = existingOrder.materials;
    let totalAmount = existingOrder.totalAmount;

    if (materials) {
      materialsWithTotals = materials.map((material) => ({
        ...material,
        total: material.quantity * material.unitCost,
      }));
      totalAmount = materialsWithTotals.reduce((sum, mat) => sum + mat.total, 0);
    }

    // Handle stock updates based on status changes
    const oldStatus = existingOrder.status;
    const newStatus = orderData.status || oldStatus;

    if (oldStatus === "Completed" && newStatus !== "Completed") {
      // Subtract stock that was added
      for (const material of existingOrder.materials) {
        await updateMaterialStock(material.materialId, material.quantity, "subtract");
      }
    }

    if (newStatus === "Completed" && oldStatus !== "Completed") {
      // Add stock
      for (const material of materialsWithTotals) {
        await updateMaterialStock(material.materialId, material.quantity, "add");
      }
    }

    const order = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      {
        ...orderData,
        materials: materialsWithTotals,
        totalAmount,
      },
      { new: true, runValidators: true }
    )
      .populate("supplierId", "name")
      .populate("materials.materialId", "name code");

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.deletePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    // Subtract stock if order was completed
    if (order.status === "Completed") {
      for (const material of order.materials) {
        await updateMaterialStock(material.materialId, material.quantity, "subtract");
      }
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

