"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import {
  fetchSalesOrders,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  fetchCustomers,
  fetchItems,
} from "@/lib/api";

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderNumber: "",
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    status: "Pending",
    items: [],
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: "orderNumber", label: "Order Number" },
    { key: "date", label: "Date" },
    { key: "customerName", label: "Customer" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = orders.map((order) => {
      const customer = customers.find((c) => c.id === order.customerId);
      return {
        ...order,
        customerName: customer ? customer.name : "-",
        totalAmount: `$${order.totalAmount.toLocaleString()}`,
      };
    }).filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders, customers]);

  async function loadData() {
    const [ordersData, customersData, itemsData] = await Promise.all([
      fetchSalesOrders(),
      fetchCustomers(),
      fetchItems(),
    ]);
    setOrders(ordersData);
    setCustomers(customersData);
    setItems(itemsData);
    setFilteredOrders(ordersData);
  }

  function handleCreate() {
    setEditingOrder(null);
    setFormData({
      orderNumber: "",
      date: new Date().toISOString().split("T")[0],
      customerId: "",
      status: "Pending",
      items: [],
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleEdit(order) {
    setEditingOrder(order);
    setFormData({
      orderNumber: order.orderNumber,
      date: order.date,
      customerId: order.customerId,
      status: order.status,
      items: order.items || [],
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleView(order) {
    const customer = customers.find((c) => c.id === order.customerId);
    const itemsList = order.items
      .map((oi) => {
        const item = items.find((i) => i.id === oi.itemId);
        return `${item ? item.name : "Unknown"}: ${oi.quantity} x $${oi.unitPrice} = $${oi.total}`;
      })
      .join("\n");
    alert(
      `Sales Order Details:\n\nOrder Number: ${order.orderNumber}\nDate: ${order.date}\nCustomer: ${customer ? customer.name : "N/A"}\nStatus: ${order.status}\n\nItems:\n${itemsList}\n\nTotal: $${order.totalAmount}`
    );
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this sales order?")) {
      await deleteSalesOrder(id);
      loadData();
    }
  }

  function addItemLine() {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { itemId: "", quantity: 1, unitPrice: 0, total: 0 },
      ],
    });
  }

  function removeItemLine(index) {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  }

  function updateItemLine(index, field, value) {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = qty * price;
    }
    setFormData({ ...formData, items: newItems });
  }

  function calculateTotal() {
    return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  }

  function validate() {
    const newErrors = {};
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = "Order number is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }
    if (formData.items.length === 0) {
      newErrors.items = "At least one item is required";
    }
    formData.items.forEach((item, idx) => {
      if (!item.itemId) {
        newErrors[`item_${idx}`] = "Item is required";
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`qty_${idx}`] = "Valid quantity is required";
      }
      if (!item.unitPrice || item.unitPrice < 0) {
        newErrors[`price_${idx}`] = "Valid unit price is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      orderNumber: formData.orderNumber.trim(),
      date: formData.date,
      customerId: formData.customerId,
      items: formData.items,
      totalAmount: calculateTotal(),
      status: formData.status,
    };

    if (editingOrder) {
      await updateSalesOrder(editingOrder.id, payload);
    } else {
      await createSalesOrder(payload);
    }

    setIsModalOpen(false);
    loadData();
  }

  return (
    <div>
      <PageHeader title="Sales Orders" actionLabel="New Sales Order" onActionClick={handleCreate} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search orders..." />
      <DataTable
        columns={columns}
        data={filteredOrders}
        renderActions={(order) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleView(order)}
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
              onClick={() => handleEdit(order)}
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
              onClick={() => handleDelete(order.id)}
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
        title={editingOrder ? "Edit Sales Order" : "Create New Sales Order"}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Order Number *
            </label>
            <input
              type="text"
              value={formData.orderNumber}
              onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.orderNumber ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.orderNumber && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.orderNumber}
              </div>
            )}
          </div>

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

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500" }}>Order Items *</label>
              <button
                type="button"
                onClick={addItemLine}
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
                Add Item
              </button>
            </div>
            {errors.items && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginBottom: "8px" }}>
                {errors.items}
              </div>
            )}
            {formData.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                  gap: "8px",
                  marginBottom: "12px",
                  alignItems: "end",
                }}
              >
                <div>
                  <select
                    value={item.itemId}
                    onChange={(e) => updateItemLine(idx, "itemId", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: `1px solid ${errors[`item_${idx}`] ? "var(--danger)" : "var(--border)"}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select Item</option>
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} (${it.sellingPrice})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItemLine(idx, "quantity", parseFloat(e.target.value) || 0)}
                    placeholder="Qty"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: `1px solid ${errors[`qty_${idx}`] ? "var(--danger)" : "var(--border)"}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItemLine(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                    placeholder="Price"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: `1px solid ${errors[`price_${idx}`] ? "var(--danger)" : "var(--border)"}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ padding: "8px", fontSize: "14px", fontWeight: "500" }}>
                  ${item.total.toFixed(2)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItemLine(idx)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "var(--danger)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              backgroundColor: "var(--hover-bg)",
              borderRadius: "6px",
              textAlign: "right",
            }}
          >
            <strong>Total: ${calculateTotal().toFixed(2)}</strong>
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
              {editingOrder ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

