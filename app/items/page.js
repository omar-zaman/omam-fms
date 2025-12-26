"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { fetchItems, createItem, updateItem, deleteItem } from "@/lib/api";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    sellingPrice: "",
    unit: "piece",
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: "name", label: "Item Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "sellingPrice", label: "Selling Price" },
  ];

  const loadItems = useCallback(async () => {
    const data = await fetchItems();
    setItems(data);
    setFilteredItems(data);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  function handleCreate() {
    setEditingItem(null);
    setFormData({
      name: "",
      sku: "",
      category: "",
      sellingPrice: "",
      unit: "piece",
      isActive: true,
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku || "",
      category: item.category || "",
      sellingPrice: item.sellingPrice.toString(),
      unit: item.unit || "piece",
      isActive: item.isActive !== false,
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleView(item) {
    alert(
      `Item Details:\n\nName: ${item.name}\nSKU: ${item.sku}\nCategory: ${item.category}\nSelling Price: $${item.sellingPrice}\nUnit: ${item.unit}\nActive: ${item.isActive ? "Yes" : "No"}`
    );
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(id);
      loadItems();
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) < 0) {
      newErrors.sellingPrice = "Valid selling price is required";
    }
    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: formData.category.trim(),
      sellingPrice: parseFloat(formData.sellingPrice),
      unit: formData.unit.trim(),
      isActive: formData.isActive,
    };

    if (editingItem) {
      await updateItem(editingItem.id, payload);
    } else {
      await createItem(payload);
    }

    setIsModalOpen(false);
    loadItems();
  }

  return (
    <div>
      <PageHeader title="Items" actionLabel="New Item" onActionClick={handleCreate} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search items..." />
      <DataTable
        columns={columns}
        data={filteredItems.map((item) => ({
          ...item,
          sellingPrice: `$${item.sellingPrice.toLocaleString()}`,
        }))}
        renderActions={(item) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleView(item)}
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
              onClick={() => handleEdit(item)}
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
              onClick={() => handleDelete(item.id)}
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
        title={editingItem ? "Edit Item" : "Create New Item"}
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
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
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
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              Selling Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.sellingPrice ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.sellingPrice && (
              <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                {errors.sellingPrice}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Unit *
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g., piece, kg, box"
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
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
              {editingItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

