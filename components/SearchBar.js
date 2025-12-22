export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px 16px",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          fontSize: "14px",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--primary)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border)";
        }}
      />
    </div>
  );
}

