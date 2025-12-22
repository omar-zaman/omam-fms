"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser, removeToken } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        setUsername(user.username || "Admin");
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    loadUser();
  }, []);

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: "var(--navbar-bg)",
        padding: "16px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
        Omam FMS
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => setShowLogout(!showLogout)}
        >
          <span style={{ fontSize: "14px", color: "var(--text-light)" }}>
            {username}
          </span>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        {showLogout && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              backgroundColor: "white",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              minWidth: "120px",
              zIndex: 100,
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "10px 16px",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "var(--text)",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {showLogout && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
          }}
          onClick={() => setShowLogout(false)}
        />
      )}
    </nav>
  );
}
