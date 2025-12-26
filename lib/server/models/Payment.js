import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    type: {
      type: String,
      enum: ["Customer", "Supplier"],
      required: [true, "Payment type is required"],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be positive"],
    },
    mode: {
      type: String,
      enum: ["Cash", "Bank", "Online"],
      default: "Cash",
    },
    reference: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre("validate", function (next) {
  if (this.type === "Customer" && !this.customerId) {
    this.invalidate("customerId", "Customer is required for customer payments");
  }
  if (this.type === "Supplier" && !this.supplierId) {
    this.invalidate("supplierId", "Supplier is required for supplier payments");
  }
  next();
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
