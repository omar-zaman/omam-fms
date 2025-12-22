"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import {
  fetchPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  fetchSuppliers,
  fetchMaterials,
} from "@/lib/api";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderNumber: "",
    date: new Date().toISOString().split("T")[0],
    supplierId: "",
    status: "Pending",
    materials: [],
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: "orderNumber", label: "Order Number" },
    { key: "date", label: "Date" },
    { key: "supplierName", label: "Supplier" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = orders.map((order) => {
      const supplier = suppliers.find((s) => s.id === order.supplierId);
      return {
        ...order,
        supplierName: supplier ? supplier.name : "-",
        totalAmount: `$${order.totalAmount.toLocaleString()}`,
      };
    }).filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders, suppliers]);

  async function loadData() {
    const [ordersData, suppliersData, materialsData] = await Promise.all([
      fetchPurchaseOrders(),
      fetchSuppliers(),
      fetchMaterials(),
    ]);
    setOrders(ordersData);
    setSuppliers(suppliersData);
    setMaterials(materialsData);
    setFilteredOrders(ordersData);
  }

  function handleCreate() {
    setEditingOrder(null);
    setFormData({
      orderNumber: "",
      date: new Date().toISOString().split("T")[0],
      supplierId: "",
      status: "Pending",
      materials: [],
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleEdit(order) {
    setEditingOrder(order);
    setFormData({
      orderNumber: order.orderNumber,
      date: order.date,
      supplierId: order.supplierId,
      status: order.status,
      materials: order.materials || [],
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleView(order) {
    const supplier = suppliers.find((s) => s.id === order.supplierId);
    const materialsList = order.materials
      .map((om) => {
        const material = materials.find((m) => m.id === om.materialId);
        return `${material ? material.name : "Unknown"}: ${om.quantity} x $${om.unitCost} = $${om.total}`;
      })
      .join("\n");
    alert(
      `Purchase Order Details:\n\nOrder Number: ${order.orderNumber}\nDate: ${order.date}\nSupplier: ${supplier ? supplier.name : "N/A"}\nStatus: ${order.status}\n\nMaterials:\n${materialsList}\n\nTotal: $${order.totalAmount}`
    );
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this purchase order?")) {
      await deletePurchaseOrder(id);
      loadData();
    }
  }

  function addMaterialLine() {
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        { materialId: "", quantity: 1, unitCost: 0, total: 0 },
      ],
    });
  }

  function removeMaterialLine(index) {
    const newMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData({ ...formData, materials: newMaterials });
  }

  function updateMaterialLine(index, field, value) {
    const newMaterials = [...formData.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    if (field === "quantity" || field === "unitCost") {
      const qty = parseFloat(newMaterials[index].quantity) || 0;
      const cost = parseFloat(newMaterials[index].unitCost) || 0;
      newMaterials[index].total = qty * cost;
    }
    setFormData({ ...formData, materials: newMaterials });
  }

  function calculateTotal() {
    return formData.materials.reduce((sum, material) => sum + (material.total || 0), 0);
  }

  function validate() {
    const newErrors = {};
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = "Order number is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.supplierId) {
      newErrors.supplierId = "Supplier is required";
    }
    if (formData.materials.length === 0) {
      newErrors.materials = "At least one material is required";
    }
    formData.materials.forEach((material, idx) => {
      if (!material.materialId) {
        newErrors[`material_${idx}`] = "Material is required";
      }
      if (!material.quantity || material.quantity <= 0) {
        newErrors[`qty_${idx}`] = "Valid quantity is required";
      }
      if (!material.unitCost || material.unitCost < 0) {
        newErrors[`cost_${idx}`] = "Valid unit cost is required";
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
      supplierId: formData.supplierId,
      materials: formData.materials,
      totalAmount: calculateTotal(),
      status: formData.status,
    };

    if (editingOrder) {
      await updatePurchaseOrder(editingOrder.id, payload);
    } else {
      await createPurchaseOrder(payload);
    }

    setIsModalOpen(false);
    loadData();
  }

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        actionLabel="New Purchase Order"
        onActionClick={handleCreate}
      />
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
        title={editingOrder ? "Edit Purchase Order" : "Create New Purchase Order"}
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
              <label style={{ fontSize: "14px", fontWeight: "500" }}>Order Materials *</label>
              <button
                type="button"
                onClick={addMaterialLine}
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
                Add Material
              </button>
            </div>
            {errors.materials && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginBottom: "8px" }}>
                {errors.materials}
              </div>
            )}
            {formData.materials.map((material, idx) => (
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
                    value={material.materialId}
                    onChange={(e) => updateMaterialLine(idx, "materialId", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: `1px solid ${errors[`material_${idx}`] ? "var(--danger)" : "var(--border)"}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select Material</option>
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name} (${mat.costPerUnit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={material.quantity}
                    onChange={(e) => updateMaterialLine(idx, "quantity", parseFloat(e.target.value) || 0)}
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
                    value={material.unitCost}
                    onChange={(e) => updateMaterialLine(idx, "unitCost", parseFloat(e.target.value) || 0)}
                    placeholder="Cost"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: `1px solid ${errors[`cost_${idx}`] ? "var(--danger)" : "var(--border)"}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ padding: "8px", fontSize: "14px", fontWeight: "500" }}>
                  ${material.total.toFixed(2)}
                </div>
                <button
                  type="button"
                  onClick={() => removeMaterialLine(idx)}
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

