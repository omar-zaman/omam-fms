export default function PageHeader({ title, actionLabel, onActionClick }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>{title}</h1>
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

