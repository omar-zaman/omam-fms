"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Login page doesn't need sidebar/navbar
  if (isLoginPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  // Other pages need full layout with sidebar and navbar
  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <main style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

