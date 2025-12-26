"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from "@/lib/api";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: "name", label: "Supplier Name" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
  ];

  const loadSuppliers = useCallback(async () => {
    const data = await fetchSuppliers();
    setSuppliers(data);
    setFilteredSuppliers(data);
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  useEffect(() => {
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm)
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  function handleCreate() {
    setEditingSupplier(null);
    setFormData({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleEdit(supplier) {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleView(supplier) {
    alert(
      `Supplier Details:\n\nName: ${supplier.name}\nContact Person: ${supplier.contactPerson}\nPhone: ${supplier.phone}\nEmail: ${supplier.email}\nAddress: ${supplier.address}`
    );
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id);
      loadSuppliers();
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
    };

    if (editingSupplier) {
      await updateSupplier(editingSupplier.id, payload);
    } else {
      await createSupplier(payload);
    }

    setIsModalOpen(false);
    loadSuppliers();
  }

  return (
    <div>
      <PageHeader title="Suppliers" actionLabel="New Supplier" onActionClick={handleCreate} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search suppliers..." />
      <DataTable
        columns={columns}
        data={filteredSuppliers}
        renderActions={(supplier) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleView(supplier)}
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
              onClick={() => handleEdit(supplier)}
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
              onClick={() => handleDelete(supplier.id)}
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
        title={editingSupplier ? "Edit Supplier" : "Create New Supplier"}
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
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
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
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "14px",
                resize: "vertical",
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
              {editingSupplier ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

