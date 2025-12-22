"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import {
  getSalesOrderReport,
  getPurchaseOrderReport,
  getCustomerPaymentReport,
  fetchCustomers,
  fetchSuppliers,
} from "@/lib/api";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [salesData, setSalesData] = useState({ orders: [], totalSales: 0 });
  const [purchaseData, setPurchaseData] = useState({ orders: [], totalPurchases: 0 });
  const [paymentData, setPaymentData] = useState({ payments: [], totalPayments: 0 });
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [salesFilters, setSalesFilters] = useState({
    dateFrom: "",
    dateTo: "",
    customerId: "",
  });
  const [purchaseFilters, setPurchaseFilters] = useState({
    dateFrom: "",
    dateTo: "",
    supplierId: "",
  });
  const [paymentFilters, setPaymentFilters] = useState({
    dateFrom: "",
    dateTo: "",
    customerId: "",
  });

  useEffect(() => {
    loadCustomersAndSuppliers();
  }, []);

  useEffect(() => {
    if (activeTab === "sales") {
      loadSalesReport();
    } else if (activeTab === "purchase") {
      loadPurchaseReport();
    } else if (activeTab === "payments") {
      loadPaymentReport();
    }
  }, [activeTab, salesFilters, purchaseFilters, paymentFilters]);

  async function loadCustomersAndSuppliers() {
    const [customersData, suppliersData] = await Promise.all([
      fetchCustomers(),
      fetchSuppliers(),
    ]);
    setCustomers(customersData);
    setSuppliers(suppliersData);
  }

  async function loadSalesReport() {
    setLoading(true);
    try {
      const filters = {};
      if (salesFilters.dateFrom) filters.dateFrom = salesFilters.dateFrom;
      if (salesFilters.dateTo) filters.dateTo = salesFilters.dateTo;
      if (salesFilters.customerId) filters.customerId = salesFilters.customerId;

      const report = await getSalesOrderReport(filters);
      setSalesData({
        orders: report.orders.map((order) => ({
          ...order,
          customerName: order.customerId?.name || order.customerName || "-",
          totalAmount: `$${order.totalAmount.toLocaleString()}`,
        })),
        totalSales: report.totalSales,
      });
    } catch (error) {
      console.error("Error loading sales report:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadPurchaseReport() {
    setLoading(true);
    try {
      const filters = {};
      if (purchaseFilters.dateFrom) filters.dateFrom = purchaseFilters.dateFrom;
      if (purchaseFilters.dateTo) filters.dateTo = purchaseFilters.dateTo;
      if (purchaseFilters.supplierId) filters.supplierId = purchaseFilters.supplierId;

      const report = await getPurchaseOrderReport(filters);
      setPurchaseData({
        orders: report.orders.map((order) => ({
          ...order,
          supplierName: order.supplierId?.name || order.supplierName || "-",
          totalAmount: `$${order.totalAmount.toLocaleString()}`,
        })),
        totalPurchases: report.totalPurchases,
      });
    } catch (error) {
      console.error("Error loading purchase report:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadPaymentReport() {
    setLoading(true);
    try {
      const filters = {};
      if (paymentFilters.dateFrom) filters.dateFrom = paymentFilters.dateFrom;
      if (paymentFilters.dateTo) filters.dateTo = paymentFilters.dateTo;
      if (paymentFilters.customerId) filters.customerId = paymentFilters.customerId;

      const report = await getCustomerPaymentReport(filters);
      setPaymentData({
        payments: report.payments.map((payment) => ({
          ...payment,
          customerName: payment.customerId?.name || payment.customerName || "-",
          amount: `$${payment.amount.toLocaleString()}`,
        })),
        totalPayments: report.totalPayments,
      });
    } catch (error) {
      console.error("Error loading payment report:", error);
    } finally {
      setLoading(false);
    }
  }

  const salesColumns = [
    { key: "orderNumber", label: "Order Number" },
    { key: "date", label: "Date" },
    { key: "customerName", label: "Customer" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
  ];

  const purchaseColumns = [
    { key: "orderNumber", label: "Order Number" },
    { key: "date", label: "Date" },
    { key: "supplierName", label: "Supplier" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
  ];

  const paymentColumns = [
    { key: "date", label: "Date" },
    { key: "customerName", label: "Customer" },
    { key: "amount", label: "Amount" },
    { key: "mode", label: "Mode" },
    { key: "reference", label: "Reference" },
  ];

  return (
    <div>
      <PageHeader title="Reports" />
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveTab("sales")}
            style={{
              padding: "12px 24px",
              backgroundColor: activeTab === "sales" ? "var(--primary)" : "transparent",
              color: activeTab === "sales" ? "white" : "var(--text)",
              border: "none",
              borderBottom: activeTab === "sales" ? "2px solid var(--primary)" : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Sales Orders
          </button>
          <button
            onClick={() => setActiveTab("purchase")}
            style={{
              padding: "12px 24px",
              backgroundColor: activeTab === "purchase" ? "var(--primary)" : "transparent",
              color: activeTab === "purchase" ? "white" : "var(--text)",
              border: "none",
              borderBottom: activeTab === "purchase" ? "2px solid var(--primary)" : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            style={{
              padding: "12px 24px",
              backgroundColor: activeTab === "payments" ? "var(--primary)" : "transparent",
              color: activeTab === "payments" ? "white" : "var(--text)",
              border: "none",
              borderBottom: activeTab === "payments" ? "2px solid var(--primary)" : "2px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Customer Payments
          </button>
        </div>
      </div>

      {activeTab === "sales" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Date From
              </label>
              <input
                type="date"
                value={salesFilters.dateFrom}
                onChange={(e) =>
                  setSalesFilters({ ...salesFilters, dateFrom: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Date To
              </label>
              <input
                type="date"
                value={salesFilters.dateTo}
                onChange={(e) => setSalesFilters({ ...salesFilters, dateTo: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Customer
              </label>
              <select
                value={salesFilters.customerId}
                onChange={(e) =>
                  setSalesFilters({ ...salesFilters, customerId: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="">All Customers</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
          ) : (
            <>
              <DataTable columns={salesColumns} data={salesData.orders} />
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  backgroundColor: "var(--hover-bg)",
                  borderRadius: "6px",
                  textAlign: "right",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Total Sales: ${salesData.totalSales.toLocaleString()}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "purchase" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Date From
              </label>
              <input
                type="date"
                value={purchaseFilters.dateFrom}
                onChange={(e) =>
                  setPurchaseFilters({ ...purchaseFilters, dateFrom: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Date To
              </label>
              <input
                type="date"
                value={purchaseFilters.dateTo}
                onChange={(e) =>
                  setPurchaseFilters({ ...purchaseFilters, dateTo: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Supplier
              </label>
              <select
                value={purchaseFilters.supplierId}
                onChange={(e) =>
                  setPurchaseFilters({ ...purchaseFilters, supplierId: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
          ) : (
            <>
              <DataTable columns={purchaseColumns} data={purchaseData.orders} />
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  backgroundColor: "var(--hover-bg)",
                  borderRadius: "6px",
                  textAlign: "right",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Total Purchases: ${purchaseData.totalPurchases.toLocaleString()}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "payments" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Date From
              </label>
              <input
                type="date"
                value={paymentFilters.dateFrom}
                onChange={(e) =>
                  setPaymentFilters({ ...paymentFilters, dateFrom: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Date To
              </label>
              <input
                type="date"
                value={paymentFilters.dateTo}
                onChange={(e) =>
                  setPaymentFilters({ ...paymentFilters, dateTo: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Customer
              </label>
              <select
                value={paymentFilters.customerId}
                onChange={(e) =>
                  setPaymentFilters({ ...paymentFilters, customerId: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="">All Customers</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
          ) : (
            <>
              <DataTable columns={paymentColumns} data={paymentData.payments} />
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  backgroundColor: "var(--hover-bg)",
                  borderRadius: "6px",
                  textAlign: "right",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Total Payments Received: ${paymentData.totalPayments.toLocaleString()}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

