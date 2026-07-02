"use client";

import { useEffect, useState } from "react";

export default function AdminIncidencias() {
  // TICKETS
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // TRABAJADORES
  const [workers, setWorkers] = useState([]);
  const [assignedWorker, setAssignedWorker] = useState("");

  // FILTROS
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [workerFilter, setWorkerFilter] = useState("all");

  // CARGAS LOS TICKETS
  const loadTickets = async () => {

    const res = await fetch("/api/tickets/list");

    const data = await res.json();

    setTickets(data);

  };

  // PARA CARGAR LOS TICKETS Y LOS TRABAJADORES
  useEffect(() => {

    loadTickets();

    fetch("/api/workers/list")
      .then((res) => res.json())
      .then((data) => {
        console.log("Trabajadores:", data);
        setWorkers(data);
      });
  }, []);

  const getColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff0000";
      case "medium":
        return "#ff9900";
      default:
        return "#4caf50";
    }
  };

  const deleteTicket = async (id) => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar la incidencia?");
    if (!confirmed) return;

    await fetch("/api/tickets/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  // ASIGNAR TRABAJADORES
  const assignWorker = async () => {

  if (!assignedWorker) {
    alert("Seleccione un trabajador");
    return;
  }

  const res = await fetch("/api/tickets/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticketId: selectedTicket.id,
      workerId: assignedWorker,
    }),
  });

  const data = await res.json();

  if (data.success) {
    alert("Trabajador asignado correctamente");

    loadTickets();

    setSelectedTicket(null);

  } else {

    alert(data.message);

  }
};

  return (
    <div style={styles.container}>
      <h1>📋 Incidencias</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >

        <button
          style={styles.addWorkerButton}
          onClick={() => window.location.href="/admin/trabajadores"}
        >
          👷 Trabajadores
        </button>

        <select
          value={priorityFilter}
          onChange={(e)=>setPriorityFilter(e.target.value)}
          style={styles.filter}
        >
          <option value="all">Todas las prioridades</option>
          <option value="high">🔴 Alta</option>
          <option value="medium">🟠 Media</option>
          <option value="low">🟢 Baja</option>
        </select>

        <select
          value={workerFilter}
          onChange={(e)=>setWorkerFilter(e.target.value)}
          style={styles.filter}
        >
          <option value="all">Todos los trabajadores</option>

          {workers.map(worker=>(
            <option
              key={worker.id}
              value={worker.id}
            >
              {worker.name}
            </option>
          ))}

        </select>

      </div>

      {tickets.filter((t) => {
        const priorityOk =
          priorityFilter === "all" ||
          t.priority === priorityFilter;

        const workerOk =
          workerFilter === "all" ||
          t.assignedWorker?.id === workerFilter;

        return priorityOk && workerOk;
      })
      .map((t) => (
        <div
          key={t.id}
          style={{
            borderLeft: `8px solid ${getColor(t.priority)}`,
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3>{t.id}</h3>

          <p><b>Usuario:</b> {t.user}</p>
          <p><b>Empresa:</b> {t.company || "No indicada"}</p>
          <p><b>Email:</b> {t.email}</p>
          <p><b>Teléfono:</b> {t.phone || "No indicada"}</p>
          <p><b>Prioridad:</b> {t.priority}</p>

          <p>
            <b>👷 Asignado a:</b>{" "}
            {t.assignedWorker
              ? `${t.assignedWorker.name} (${t.assignedWorker.role})`
              : "Sin asignar"}
          </p>

          <div style={styles.actions}>
            <button
              style={styles.viewBtn}
              onClick={() => {
                setSelectedTicket(t);

                setAssignedWorker(
                  t.assignedWorker?.id || ""
                );

              }}
            >
              👁 Ver
            </button>

            <button
              style={styles.deleteBtn}
              onClick={() => deleteTicket(t.id)}
            >
              🗑 Eliminar
            </button>
          </div>
        </div>
      ))}

      {/* POPUP DETALLE */}
      {selectedTicket && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>{selectedTicket.id}</h2>

            <p><b>Usuario:</b> {selectedTicket.user}</p>
            <p><b>Empresa:</b> {selectedTicket.company || "No indicada"}</p>
            <p><b>Email:</b> {selectedTicket.email}</p>
            <p><b>Teléfono:</b> {selectedTicket.phone || "No indicado"}</p>
            <p><b>Ubicación:</b> {selectedTicket.location}</p>

            <h3 style={{
              marginTop: "20px",
              marginBottom: "15px",
              }}>
                💬 Conversación</h3>

            <div style={styles.chat}>
              {selectedTicket.conversation?.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "15px",
                  }}
                >
                  <strong>
                    {msg.role === "user"
                      ? `${selectedTicket.user} (Usuario)`
                      : "IA"}
                  </strong>

                  <div
                    style={{
                      marginTop: "5px",
                      marginLeft: "10px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
              <select
                value={assignedWorker}
                onChange={(e) => setAssignedWorker(e.target.value)}
              >
                <option value="">Selecciona un trabajador</option>

                {workers.map((worker) => (
                  <option
                    key={worker.id}
                    value={worker.id}
                  >
                    {worker.name} - {worker.role} ({worker.level})
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
              <button
                onClick={assignWorker}
                style={{
                  flex: 1,
                  background: "#1976d2",
                  color: "#fff",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {selectedTicket?.assignedWorker
                  ? "🔄 Reasignar trabajador"
                  : "👷 Asignar trabajador"}
              </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    flex: 1,
                    background: "#ff0000",
                    color: "#fff",
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cerrar
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================
// 🎨 ESTILOS
// =========================
const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    color: "#111",
    border: "2px black",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

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

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "700px",
    color: "#111",
  },

  chat: {
    whiteSpace: "pre-wrap",
    backgroundColor: "#ffffff",
    color: "#111",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    maxHeight: "300px",
    overflowY: "auto",
  },

  closeBtn: {
    marginTop: "15px",
    padding: "10px 14px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  filter: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "220px",
    background: "#fff",
    cursor: "pointer",
  },

  addWorkerButton: {
    padding: "10px 18px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};