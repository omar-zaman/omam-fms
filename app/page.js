"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        router.push("/dashboard");
      } catch {
        router.push("/login");
      }
    }
    checkAuth();
  }, [router]);

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
      <div style={{ textAlign: "center", color: "var(--text-light)" }}>
        Loading...
      </div>
    </div>
  );
}

