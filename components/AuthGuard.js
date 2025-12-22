"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // Allow access to login page without authentication
      if (pathname === "/login") {
        setLoading(false);
        setAuthenticated(true); // Allow login page to render
        return;
      }

      try {
        await getCurrentUser();
        setAuthenticated(true);
      } catch (error) {
        // Not authenticated, redirect to login
        router.push("/login");
        return;
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "18px",
              color: "var(--text-light)",
              marginBottom: "8px",
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Don't render children if on login page (login page has its own layout)
  if (pathname === "/login") {
    return children;
  }

  // Only render children if authenticated
  if (!authenticated) {
    return null;
  }

  return children;
}
