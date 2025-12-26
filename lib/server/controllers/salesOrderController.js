import SalesOrder from "@/lib/server/models/SalesOrder";
import InventoryRecord from "@/lib/server/models/InventoryRecord";

async function updateInventory(itemId, quantity, operation) {
  let inventory = await InventoryRecord.findOne({ itemId });
  if (!inventory) {
    inventory = new InventoryRecord({ itemId, currentStock: 0, reservedStock: 0 });
  }

  if (operation === "reserve") {
    inventory.reservedStock += quantity;
  } else if (operation === "release") {
    inventory.reservedStock = Math.max(0, inventory.reservedStock - quantity);
  } else if (operation === "deduct") {
    inventory.currentStock = Math.max(0, inventory.currentStock - quantity);
    inventory.reservedStock = Math.max(0, inventory.reservedStock - quantity);
  }

  inventory.availableStock = inventory.currentStock - inventory.reservedStock;
  await inventory.save();
}

export const getAllSalesOrders = async (req, res, next) => {
  try {
    const { search, dateFrom, dateTo, customerId } = req.query;
    let query = {};

    if (search) {
      query.orderNumber = { $regex: search, $options: "i" };
    }
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (customerId) {
      query.customerId = customerId;
    }

    const orders = await SalesOrder.find(query)
      .populate("customerId", "name")
      .populate("items.itemId", "name sku")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getSalesOrderById = async (req, res, next) => {
  try {
    const order = await SalesOrder.findById(req.params.id)
      .populate("customerId")
      .populate("items.itemId");
    if (!order) {
      return res.status(404).json({ message: "Sales order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const createSalesOrder = async (req, res, next) => {
  try {
    const { items, ...orderData } = req.body;

    const itemsWithTotals = items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const totalAmount = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);

    const order = new SalesOrder({
      ...orderData,
      items: itemsWithTotals,
      totalAmount,
    });

    await order.save();

    if (order.status === "Pending") {
      for (const item of itemsWithTotals) {
        await updateInventory(item.itemId, item.quantity, "reserve");
      }
    } else if (order.status === "Completed") {
      for (const item of itemsWithTotals) {
        await updateInventory(item.itemId, item.quantity, "deduct");
      }
    }

    await order.populate("customerId", "name");
    await order.populate("items.itemId", "name sku");

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateSalesOrder = async (req, res, next) => {
  try {
    const existingOrder = await SalesOrder.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    const { items, ...orderData } = req.body;

    let itemsWithTotals = existingOrder.items;
    let totalAmount = existingOrder.totalAmount;

    if (items) {
      itemsWithTotals = items.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }));
      totalAmount = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);
    }

    const oldStatus = existingOrder.status;
    const newStatus = orderData.status || oldStatus;

    if (oldStatus === "Pending" && newStatus !== "Pending") {
      for (const item of existingOrder.items) {
        await updateInventory(item.itemId, item.quantity, "release");
      }
    }

    if (newStatus === "Pending" && oldStatus !== "Pending") {
      for (const item of itemsWithTotals) {
        await updateInventory(item.itemId, item.quantity, "reserve");
      }
    } else if (newStatus === "Completed" && oldStatus !== "Completed") {
      for (const item of itemsWithTotals) {
        await updateInventory(item.itemId, item.quantity, "deduct");
      }
    }

    const order = await SalesOrder.findByIdAndUpdate(
      req.params.id,
      {
        ...orderData,
        items: itemsWithTotals,
        totalAmount,
      },
      { new: true, runValidators: true }
    )
      .populate("customerId", "name")
      .populate("items.itemId", "name sku");

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteSalesOrder = async (req, res, next) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    if (order.status === "Pending") {
      for (const item of order.items) {
        await updateInventory(item.itemId, item.quantity, "release");
      }
    }

    await SalesOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Sales order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
