import PurchaseOrder from "@/lib/server/models/PurchaseOrder";
import InventoryRecord from "@/lib/server/models/InventoryRecord";

async function updateInventory(materialId, quantity, operation) {
  let inventory = await InventoryRecord.findOne({ itemId: materialId });
  if (!inventory) {
    inventory = new InventoryRecord({ itemId: materialId, currentStock: 0, reservedStock: 0 });
  }

  if (operation === "add") {
    inventory.currentStock += quantity;
  } else if (operation === "reverse") {
    inventory.currentStock = Math.max(0, inventory.currentStock - quantity);
  }

  inventory.availableStock = inventory.currentStock - inventory.reservedStock;
  await inventory.save();
}

export const getAllPurchaseOrders = async (req, res, next) => {
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
      .populate("materials.materialId", "name sku")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrderById = async (req, res, next) => {
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

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const { materials, ...orderData } = req.body;

    const materialsWithTotals = materials.map((material) => ({
      ...material,
      total: material.quantity * material.unitCost,
    }));

    const totalAmount = materialsWithTotals.reduce((sum, material) => sum + material.total, 0);

    const order = new PurchaseOrder({
      ...orderData,
      materials: materialsWithTotals,
      totalAmount,
    });

    await order.save();

    if (order.status === "Completed") {
      for (const material of materialsWithTotals) {
        await updateInventory(material.materialId, material.quantity, "add");
      }
    }

    await order.populate("supplierId", "name");
    await order.populate("materials.materialId", "name sku");

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseOrder = async (req, res, next) => {
  try {
    const existingOrder = await PurchaseOrder.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    const { materials, ...orderData } = req.body;

    let materialsWithTotals = existingOrder.materials;
    let totalAmount = existingOrder.totalAmount;

    if (materials) {
      materialsWithTotals = materials.map((material) => ({
        ...material,
        total: material.quantity * material.unitCost,
      }));
      totalAmount = materialsWithTotals.reduce((sum, material) => sum + material.total, 0);
    }

    const oldStatus = existingOrder.status;
    const newStatus = orderData.status || oldStatus;

    if (oldStatus === "Completed" && newStatus !== "Completed") {
      for (const material of existingOrder.materials) {
        await updateInventory(material.materialId, material.quantity, "reverse");
      }
    }

    if (newStatus === "Completed" && oldStatus !== "Completed") {
      for (const material of materialsWithTotals) {
        await updateInventory(material.materialId, material.quantity, "add");
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
      .populate("materials.materialId", "name sku");

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deletePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    if (order.status === "Completed") {
      for (const material of order.materials) {
        await updateInventory(material.materialId, material.quantity, "reverse");
      }
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
