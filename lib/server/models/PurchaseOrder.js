import mongoose from "mongoose";

const materialLineSchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  unitCost: {
    type: Number,
    required: true,
    min: [0, "Unit cost must be positive"],
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total must be positive"],
  },
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "Supplier is required"],
    },
    materials: {
      type: [materialLineSchema],
      required: [true, "At least one material is required"],
      validate: {
        validator: function (materials) {
          return materials && materials.length > 0;
        },
        message: "At least one material is required",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount must be positive"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseOrder =
  mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", purchaseOrderSchema);
export default PurchaseOrder;
