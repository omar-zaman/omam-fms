import InventoryRecord from "@/lib/server/models/InventoryRecord";
import Item from "@/lib/server/models/Item";

export const getAllInventory = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const items = await Item.find({
        name: { $regex: search, $options: "i" },
      });
      const itemIds = items.map((item) => item._id);
      query.itemId = { $in: itemIds };
    }

    const inventory = await InventoryRecord.find(query)
      .populate("itemId", "name sku")
      .sort({ createdAt: -1 });

    const formatted = inventory.map((inv) => ({
      id: inv._id,
      itemId: inv.itemId._id,
      itemName: inv.itemId.name,
      currentStock: inv.currentStock,
      reservedStock: inv.reservedStock,
      availableStock: inv.availableStock,
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

export const getInventoryByItemId = async (req, res, next) => {
  try {
    const inventory = await InventoryRecord.findOne({ itemId: req.params.itemId }).populate("itemId");
    if (!inventory) {
      return res.status(404).json({ message: "Inventory record not found" });
    }
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};
