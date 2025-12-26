"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import { fetchInventory } from "@/lib/api";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { key: "itemName", label: "Item Name" },
    { key: "currentStock", label: "Current Stock" },
    { key: "reservedStock", label: "Reserved Stock" },
    { key: "availableStock", label: "Available Stock" },
  ];

  const loadInventory = useCallback(async () => {
    const data = await fetchInventory();
    setInventory(data);
    setFilteredInventory(data);
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    const filtered = inventory.filter((inv) =>
      inv.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  return (
    <div>
      <PageHeader title="Inventory" />
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search inventory..." />
      <DataTable columns={columns} data={filteredInventory} />
    </div>
  );
}

