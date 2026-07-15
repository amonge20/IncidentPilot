"use client";

export default function StatsCards({ tickets }) {
  const abiertas = tickets.filter(
    t => t.status !== "Finalizado"
  ).length;

  const pendientes = tickets.filter(
    t => t.status === "Pendiente"
  ).length;

  const finalizadas = tickets.filter(
    t => t.status === "Finalizado"
  ).length;

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <Card
        title="Incidencias"
        value={tickets.length}
        color="#1976d2"
      />

      <Card
        title="Pendientes"
        value={pendientes}
        color="#ff9800"
      />

      <Card
        title="Finalizadas"
        value={finalizadas}
        color="#4caf50"
      />

      <Card
        title="Activas"
        value={abiertas}
        color="#9c27b0"
      />
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        background: color,
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}