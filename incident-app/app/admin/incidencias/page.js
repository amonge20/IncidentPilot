"use client";

import { useEffect, useState } from "react";

export default function AdminIncidencias() {
  const [tickets, setTickets] = useState([]);

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

  return (
    <div style={{ padding: "30px" }}>
      <h1>📋 Incidencias</h1>

      {tickets.map((t) => (
        <div
          key={t.id}
          style={{
            borderLeft: `8px solid ${getColor(t.priority)}`,
            padding: "15px",
            marginBottom: "15px",
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <h3>{t.id}</h3>

          <p><b>Usuario:</b> {t.user}</p>
          <p><b>Empresa:</b> {t.company || "No indicada"}</p>
          <p><b>Email:</b> {t.email}</p>
          <p><b>Ubicación:</b> {t.location}</p>
          <p><b>Prioridad:</b> {t.priority}</p>

          <h4>Conversación</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(t.conversation, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}