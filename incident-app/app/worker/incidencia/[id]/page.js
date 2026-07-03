"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function WorkerIncidencia() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTicket();
    }
  }, [id]);

  async function loadTicket() {
    try {
      console.log("ID recibido:", id);

      const res = await fetch("/api/tickets/get/" + id);

      console.log("Status:", res.status);

      if (!res.ok) {
        const error = await res.json();

        console.error(error);

        setLoading(false);

        return;
      }

      const data = await res.json();

      console.log("INC:", data);

      setTicket(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        Cargando incidencia...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No se encontró la incidencia</h2>

        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>Incidencia {ticket.id}</h1>

      <hr />

      <p>
        <b>Cliente:</b> {ticket.user}
      </p>

      <p>
        <b>Empresa:</b> {ticket.company}
      </p>

      <p>
        <b>Email:</b> {ticket.email}
      </p>

      <p>
        <b>Dirección:</b> {ticket.location}
      </p>

      <p>
        <b>Prioridad:</b> {ticket.priority}
      </p>

      <p>
        <b>Descripción:</b>
      </p>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "10px",
          lineHeight: 1.6,
          color: "black",
        }}
      >
        {ticket.summary || "No hay resumen disponible"}
      </div>

      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: 30,
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Volver
      </button>
    </div>
  );
}