"use client";

export default function StatusBadge({ status }) {

  const colors = {
    OPEN: "#777",
    "En camino": "#f39c12",
    "En cliente": "#3498db",
    "En progreso": "#9b59b6",
    Pendiente: "#e67e22",
    Finalizado: "#2ecc71",
  };

  return (
    <span
      style={{
        background: colors[status] || "#777",
        color: "#fff",
        padding: "5px 12px",
        borderRadius: 8,
      }}
    >
      {status}
    </span>
  );
}