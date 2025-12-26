"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import {
  fetchPayments,
  createPayment,
  updatePayment,
  deletePayment,
  fetchCustomers,
  fetchSuppliers,
} from "@/lib/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "Customer",
    customerId: "",
    supplierId: "",
    amount: "",
    mode: "Cash",
    reference: "",
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "name", label: "Name" },
    { key: "amount", label: "Amount" },
    { key: "mode", label: "Mode" },
    { key: "reference", label: "Reference" },
  ];

  const loadData = useCallback(async () => {
    const [paymentsData, customersData, suppliersData] = await Promise.all([
      fetchPayments(),
      fetchCustomers(),
      fetchSuppliers(),
    ]);
    setPayments(paymentsData);
    setCustomers(customersData);
    setSuppliers(suppliersData);
    setFilteredPayments(paymentsData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const filtered = payments.map((payment) => {
      let name = "-";
      if (payment.type === "Customer" && payment.customerId) {
        const customer = customers.find((c) => c.id === payment.customerId);
        name = customer ? customer.name : "-";
      } else if (payment.type === "Supplier" && payment.supplierId) {
        const supplier = suppliers.find((s) => s.id === payment.supplierId);
        name = supplier ? supplier.name : "-";
      }
      return {
        ...payment,
        name,
        amount: `$${payment.amount.toLocaleString()}`,
      };
    }).filter(
      (payment) =>
        payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [searchTerm, payments, customers, suppliers]);

  function handleCreate() {
    setEditingPayment(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "Customer",
      customerId: "",
      supplierId: "",
      amount: "",
      mode: "Cash",
      reference: "",
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleEdit(payment) {
    setEditingPayment(payment);
    setFormData({
      date: payment.date,
      type: payment.type,
      customerId: payment.customerId || "",
      supplierId: payment.supplierId || "",
      amount: payment.amount.toString(),
      mode: payment.mode,
      reference: payment.reference,
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleView(payment) {
    let name = "-";
    if (payment.type === "Customer" && payment.customerId) {
      const customer = customers.find((c) => c.id === payment.customerId);
      name = customer ? customer.name : "-";
    } else if (payment.type === "Supplier" && payment.supplierId) {
      const supplier = suppliers.find((s) => s.id === payment.supplierId);
      name = supplier ? supplier.name : "-";
    }
    alert(
      `Payment Details:\n\nDate: ${payment.date}\nType: ${payment.type}\nName: ${name}\nAmount: $${payment.amount}\nMode: ${payment.mode}\nReference: ${payment.reference}`
    );
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this payment?")) {
      await deletePayment(id);
      loadData();
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (formData.type === "Customer" && !formData.customerId) {
      newErrors.customerId = "Customer is required";
    }
    if (formData.type === "Supplier" && !formData.supplierId) {
      newErrors.supplierId = "Supplier is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      date: formData.date,
      type: formData.type,
      customerId: formData.type === "Customer" ? formData.customerId : null,
      supplierId: formData.type === "Supplier" ? formData.supplierId : null,
      amount: parseFloat(formData.amount),
      mode: formData.mode,
      reference: formData.reference.trim(),
    };

    if (editingPayment) {
      await updatePayment(editingPayment.id, payload);
    } else {
      await createPayment(payload);
    }

    setIsModalOpen(false);
    loadData();
  }

  return (
    <div>
      <PageHeader title="Payments" actionLabel="New Payment" onActionClick={handleCreate} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search payments..." />
      <DataTable
        columns={columns}
        data={filteredPayments}
        renderActions={(payment) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleView(payment)}
              style={{
                padding: "6px 12px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              View
            </button>
            <button
              onClick={() => handleEdit(payment)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#059669",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(payment.id)}
              style={{
                padding: "6px 12px",
                backgroundColor: "var(--danger)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPayment ? "Edit Payment" : "Create New Payment"}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.date ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.date && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.date}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value,
                  customerId: "",
                  supplierId: "",
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>

          {formData.type === "Customer" ? (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Customer *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.customerId ? "var(--danger)" : "var(--border)"}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                  {errors.customerId}
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Supplier *
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.supplierId ? "var(--danger)" : "var(--border)"}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                  {errors.supplierId}
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.amount ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.amount && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.amount}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Mode
            </label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Reference
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--hover-bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {editingPayment ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

