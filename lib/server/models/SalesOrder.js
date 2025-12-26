import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, "Unit price must be positive"],
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total must be positive"],
  },
});

const salesOrderSchema = new mongoose.Schema(
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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    items: {
      type: [lineItemSchema],
      required: [true, "At least one item is required"],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "At least one item is required",
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

const SalesOrder = mongoose.models.SalesOrder || mongoose.model("SalesOrder", salesOrderSchema);
export default SalesOrder;
