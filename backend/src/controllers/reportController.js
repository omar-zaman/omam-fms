const SalesOrder = require("../models/SalesOrder");
const PurchaseOrder = require("../models/PurchaseOrder");
const Payment = require("../models/Payment");

// Sales Order Report
exports.getSalesOrderReport = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, customerId } = req.query;
    let query = {};

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
      .sort({ date: -1 });

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      orders,
      totalSales,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

// Purchase Order Report
exports.getPurchaseOrderReport = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, supplierId } = req.query;
    let query = {};

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
      .sort({ date: -1 });

    const totalPurchases = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      orders,
      totalPurchases,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

// Customer Payment Report
exports.getCustomerPaymentReport = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, customerId } = req.query;
    let query = { type: "Customer" };

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (customerId) {
      query.customerId = customerId;
    }

    const payments = await Payment.find(query)
      .populate("customerId", "name")
      .sort({ date: -1 });

    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      payments,
      totalPayments,
      count: payments.length,
    });
  } catch (error) {
    next(error);
  }
};

