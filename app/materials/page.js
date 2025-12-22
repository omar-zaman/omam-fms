"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import {
  fetchMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  fetchSuppliers,
} from "@/lib/api";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    unit: "kg",
    costPerUnit: "",
    supplierId: "",
    stockQuantity: "",
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: "name", label: "Material Name" },
    { key: "code", label: "Code" },
    { key: "supplierName", label: "Supplier" },
    { key: "unit", label: "Unit" },
    { key: "costPerUnit", label: "Cost per Unit" },
    { key: "stockQuantity", label: "Stock Quantity" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = materials.map((m) => {
      const supplier = suppliers.find((s) => s.id === m.supplierId);
      return {
        ...m,
        supplierName: supplier ? supplier.name : "-",
        costPerUnit: `$${m.costPerUnit.toLocaleString()}`,
      };
    }).filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
  }, [searchTerm, materials, suppliers]);

  async function loadData() {
    const [materialsData, suppliersData] = await Promise.all([
      fetchMaterials(),
      fetchSuppliers(),
    ]);
    setMaterials(materialsData);
    setSuppliers(suppliersData);
    setFilteredMaterials(materialsData);
  }

  function handleCreate() {
    setEditingMaterial(null);
    setFormData({
      name: "",
      code: "",
      unit: "kg",
      costPerUnit: "",
      supplierId: "",
      stockQuantity: "",
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleEdit(material) {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      code: material.code || "",
      unit: material.unit || "kg",
      costPerUnit: material.costPerUnit.toString(),
      supplierId: material.supplierId || "",
      stockQuantity: material.stockQuantity.toString(),
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleView(material) {
    const supplier = suppliers.find((s) => s.id === material.supplierId);
    alert(
      `Material Details:\n\nName: ${material.name}\nCode: ${material.code}\nUnit: ${material.unit}\nCost per Unit: $${material.costPerUnit}\nSupplier: ${supplier ? supplier.name : "N/A"}\nStock Quantity: ${material.stockQuantity}`
    );
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this material?")) {
      await deleteMaterial(id);
      loadData();
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.costPerUnit || parseFloat(formData.costPerUnit) < 0) {
      newErrors.costPerUnit = "Valid cost per unit is required";
    }
    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }
    if (formData.stockQuantity && parseFloat(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = "Stock quantity must be >= 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      unit: formData.unit.trim(),
      costPerUnit: parseFloat(formData.costPerUnit),
      supplierId: formData.supplierId || null,
      stockQuantity: parseFloat(formData.stockQuantity) || 0,
    };

    if (editingMaterial) {
      await updateMaterial(editingMaterial.id, payload);
    } else {
      await createMaterial(payload);
    }

    setIsModalOpen(false);
    loadData();
  }

  return (
    <div>
      <PageHeader title="Materials" actionLabel="New Material" onActionClick={handleCreate} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search materials..." />
      <DataTable
        columns={columns}
        data={filteredMaterials}
        renderActions={(material) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleView(material)}
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
              onClick={() => handleEdit(material)}
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
              onClick={() => handleDelete(material.id)}
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
        title={editingMaterial ? "Edit Material" : "Create New Material"}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.name ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.name && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.name}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Unit *
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.unit ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.unit && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.unit}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Cost per Unit *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.costPerUnit ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.costPerUnit && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.costPerUnit}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Supplier
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
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
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.stockQuantity ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.stockQuantity && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.stockQuantity}
              </div>
            )}
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
              {editingMaterial ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

