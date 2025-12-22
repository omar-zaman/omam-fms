"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import {
  fetchItems,
  fetchCustomers,
  fetchSuppliers,
  fetchSalesOrders,
  fetchPurchaseOrders,
  fetchInventory,
} from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalInventory: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [items, customers, suppliers, salesOrders, purchaseOrders, inventory] =
          await Promise.all([
            fetchItems(),
            fetchCustomers(),
            fetchSuppliers(),
            fetchSalesOrders(),
            fetchPurchaseOrders(),
            fetchInventory(),
          ]);

        const totalSales = salesOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalPurchases = purchaseOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        const totalInventory = inventory.reduce(
          (sum, inv) => sum + (inv.currentStock || 0),
          0
        );

        setStats({
          totalItems: items.length,
          totalCustomers: customers.length,
          totalSuppliers: suppliers.length,
          totalSales,
          totalPurchases,
          totalInventory,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <Card title="Total Items" value={stats.totalItems} />
        <Card title="Total Customers" value={stats.totalCustomers} />
        <Card title="Total Suppliers" value={stats.totalSuppliers} />
        <Card
          title="Total Sales Amount"
          value={`$${stats.totalSales.toLocaleString()}`}
        />
        <Card
          title="Total Purchase Amount"
          value={`$${stats.totalPurchases.toLocaleString()}`}
        />
        <Card title="Total Inventory" value={stats.totalInventory} subtitle="units" />
      </div>
    </div>
  );
}

