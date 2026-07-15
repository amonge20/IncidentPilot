export default function SummaryBox({ tickets }) {
  const total = tickets.length;

  const high = tickets.filter(
    t => t.priority === "high"
  ).length;

  const medium = tickets.filter(
    t => t.priority === "medium"
  ).length;

  const low = tickets.filter(
    t => t.priority === "low"
  ).length;

  const pending = tickets.filter(
    t => t.status === "Pendiente"
  ).length;

  const finished = tickets.filter(
    t =>
      t.status === "Finalizado" ||
      t.status === "FINALIZADA"
  ).length;

  const withoutWorker = tickets.filter(
    t => !t.assignedWorker
  ).length;

  const cards = [
    {
      title: "Incidencias",
      value: total,
      color: "#1976d2",
      icon: "📋"
    },
    {
      title: "Alta",
      value: high,
      color: "#d32f2f",
      icon: "🔴"
    },
    {
      title: "Media",
      value: medium,
      color: "#f57c00",
      icon: "🟠"
    },
    {
      title: "Baja",
      value: low,
      color: "#2e7d32",
      icon: "🟢"
    },
    {
      title: "Pendientes",
      value: pending,
      color: "#fb8c00",
      icon: "⏳"
    },
    {
      title: "Finalizadas",
      value: finished,
      color: "#43a047",
      icon: "✅"
    },
    {
      title: "Sin asignar",
      value: withoutWorker,
      color: "#616161",
      icon: "👷"
    }
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
        gap: "18px",
        marginBottom: "35px",
        marginTop: "20px",
      }}
    >

      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "#fff",
            borderLeft: `6px solid ${card.color}`,
            borderRadius: "10px",
            padding: "20px",
            boxShadow:
              "0 3px 8px rgba(0,0,0,.08)"
          }}
        >
          <div
            style={{
              fontSize: "15px",
              color: "#666"
            }}
          >
            {card.icon} {card.title}
          </div>

          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginTop: "10px",
              color: card.color
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}