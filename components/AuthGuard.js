"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => {
    // Allow access to login page without authentication
    if (pathname === "/login") {
      if (status === "authenticated") {
        router.replace("/dashboard");
      }
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/login");
    }

  }, [pathname, router, status]);

  // Show loading state while checking authentication
  if (status === "loading") {
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
  if (status !== "authenticated") {
    return null;
  }

  return children;
}
