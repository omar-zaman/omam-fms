"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Items", path: "/items" },
  { label: "Materials", path: "/materials" },
  { label: "Suppliers", path: "/suppliers" },
  { label: "Customers", path: "/customers" },
  { label: "Sales Orders", path: "/sales-orders" },
  { label: "Purchase Orders", path: "/purchase-orders" },
  { label: "Payments", path: "/payments" },
  { label: "Inventory", path: "/inventory" },
  { label: "Reports", path: "/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "250px",
        backgroundColor: "var(--sidebar-bg)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div style={{ padding: "0 20px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
          Omam FMS
        </h1>
      </div>
      <nav style={{ flex: 1, paddingTop: "20px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: "block",
                padding: "12px 20px",
                color: isActive ? "var(--active-text)" : "rgba(255,255,255,0.8)",
                backgroundColor: isActive ? "var(--active-bg)" : "transparent",
                textDecoration: "none",
                transition: "all 0.2s",
                borderLeft: isActive ? "3px solid var(--active-bg)" : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

