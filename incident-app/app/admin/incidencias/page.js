"use client";

import { useEffect, useState } from "react";

export default function AdminIncidencias() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetch("/api/tickets/list")
      .then((res) => {
        if (!res.ok) throw new Error("Error en API");
        return res.json();
      })
      .then((data) => setTickets(data))
      .catch((err) => {
        console.error("Error cargando tickets:", err);
        setTickets([]);
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

  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}>

        <h1>📋 Incidencias</h1>

        <button
          onClick={() => window.location.href="/admin/trabajadores"}
          style={{
            padding: "10px 18px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}>
          👷 Trabajadores
        </button>
      </div>

      {tickets.map((t) => (
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

          <div style={styles.actions}>
            <button
              style={styles.viewBtn}
              onClick={() => setSelectedTicket(t)}
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

            <button style={styles.closeBtn} onClick={() => setSelectedTicket(null)}>
              Cerrar
            </button>
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
};