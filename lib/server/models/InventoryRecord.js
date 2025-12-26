import mongoose from "mongoose";

const inventoryRecordSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item is required"],
      unique: true,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: [0, "Current stock cannot be negative"],
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: [0, "Reserved stock cannot be negative"],
    },
    availableStock: {
      type: Number,
      default: 0,
      min: [0, "Available stock cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

inventoryRecordSchema.pre("save", function (next) {
  this.availableStock = this.currentStock - this.reservedStock;
  if (this.availableStock < 0) {
    this.availableStock = 0;
  }
  next();
});

const InventoryRecord =
  mongoose.models.InventoryRecord || mongoose.model("InventoryRecord", inventoryRecordSchema);
export default InventoryRecord;
