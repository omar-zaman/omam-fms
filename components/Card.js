export default function Card({ title, value, subtitle }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "8px" }}>
        {title}
      </div>
      <div style={{ fontSize: "28px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {subtitle && (
        <div style={{ fontSize: "12px", color: "var(--text-light)" }}>{subtitle}</div>
      )}
    </div>
  );
}

