"use client";

export default function TicketCard({
  ticket,
  onView,
  onDelete,
}) {

  function getPriorityColor(priority) {
    switch (priority) {
      case "high":
        return "#ff0000";
      case "medium":
        return "#ff9900";
      default:
        return "#4caf50";
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "En camino":
        return "#f39c12";
      case "En cliente":
        return "#3498db";
      case "En progreso":
        return "#9b59b6";
      case "Pendiente":
        return "#e67e22";
      case "Finalizado":
        return "#2ecc71";
      default:
        return "#777";
    }
  }

  return (
    <div
      style={{
        borderLeft: `8px solid ${getPriorityColor(ticket.priority)}`,
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >

      <h3>{ticket.id}</h3>

      <p>
        <b>Usuario:</b> {ticket.user}
      </p>

      <p>
        <b>Empresa:</b>{" "}
        {ticket.company || "No indicada"}
      </p>

      <p>
        <b>Email:</b> {ticket.email}
      </p>

      <p>
        <b>Teléfono:</b>{" "}
        {ticket.phone || "No indicado"}
      </p>

      <p>
        <b>Prioridad:</b> {ticket.priority}
      </p>

      <p>

        <b>Estado:</b>{" "}

        <span
          style={{
            padding: "5px 10px",
            borderRadius: "8px",
            background: getStatusColor(ticket.status),
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {ticket.status || "OPEN"}
        </span>

      </p>

      <p>

        <b>👷 Asignado a:</b>{" "}

        {ticket.assignedWorker
          ? `${ticket.assignedWorker.name} (${ticket.assignedWorker.role})`
          : "Sin asignar"}

      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >

        <button
          onClick={() => onView(ticket)}
          style={styles.viewBtn}
        >
          👁 Ver
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(ticket.id)}
            style={styles.deleteBtn}
          >
            🗑 Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  viewBtn: {
    padding: "8px 14px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteBtn: {
    padding: "8px 14px",
    backgroundColor: "#d60000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};