import Payment from "@/lib/server/models/Payment";

export const getAllPayments = async (req, res, next) => {
  try {
    const { search, type, dateFrom, dateTo, customerId, supplierId } = req.query;
    let query = {};

    if (search) {
      query.reference = { $regex: search, $options: "i" };
    }
    if (type) {
      query.type = type;
    }
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (customerId) {
      query.customerId = customerId;
    }
    if (supplierId) {
      query.supplierId = supplierId;
    }

    const payments = await Payment.find(query)
      .populate("customerId", "name")
      .populate("supplierId", "name")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("customerId")
      .populate("supplierId");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    await payment.populate("customerId", "name");
    await payment.populate("supplierId", "name");
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("customerId", "name")
      .populate("supplierId", "name");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
