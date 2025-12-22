export default function DataTable({ columns, data, renderActions }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--hover-bg)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {col.label}
              </th>
            ))}
            {renderActions && (
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--text-light)",
                }}
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "var(--text)",
                    }}
                  >
                    {row[col.key] !== undefined && row[col.key] !== null
                      ? typeof row[col.key] === "number"
                        ? row[col.key].toLocaleString()
                        : String(row[col.key])
                      : "-"}
                  </td>
                ))}
                {renderActions && (
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                    }}
                  >
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

