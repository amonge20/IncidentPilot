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
      const res = await fetch("/api/tickets/get/" + id);

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();

      setTicket(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  // ==========================
  // CAMBIAR ESTADO
  // ==========================

  async function changeStatus(status, action) {

    const worker = JSON.parse(
      localStorage.getItem("worker")
    );

    const res = await fetch("/api/tickets/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: ticket.id,
        status,
        workerName: worker.name,
        action,
      }),
    });

    const data = await res.json();

    if (data.success) {
      loadTicket();
    } else {
      alert("No se pudo actualizar.");
    }
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
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 900,
        margin: "auto",
      }}
    >
      <h1>Incidencia {ticket.id}</h1>

      <hr />

      <p><b>Cliente:</b> {ticket.user}</p>

      <p><b>Empresa:</b> {ticket.company}</p>

      <p><b>Email:</b> {ticket.email}</p>

      <p><b>Dirección:</b> {ticket.location}</p>

      <p><b>Prioridad:</b> {ticket.priority}</p>

      <p>
        <b>Estado:</b>{" "}
        <span
          style={{
            background: "#1976d2",
            color: "#fff",
            padding: "5px 12px",
            borderRadius: 8,
          }}
        >
          {ticket.status}
        </span>
      </p>

      <h3>Resumen IA</h3>

      <div
        style={{
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
          color: "#000",
          marginBottom: 30,
        }}
      >
        {ticket.summary || "No hay resumen disponible"}
      </div>

      {/* BOTONES */}

      <div
        style={{
          display: "flex",
          gap: 15,
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >

        <button
          onClick={() =>
            changeStatus(
              "En camino",
              "Ha salido hacia el cliente"
            )
          }
        >
          🚗 En camino
        </button>

        <button
          onClick={() =>
            changeStatus(
              "En cliente",
              "Ha llegado al cliente"
            )
          }
        >
          📍 He llegado
        </button>

        <button
          onClick={() =>
            changeStatus(
              "En progreso",
              "Ha iniciado la reparación"
            )
          }
        >
          🛠 Empezar
        </button>

        <button
          onClick={() =>
            window.location.href =
              "/worker/incidencia/" + ticket.id + "/finalizar"
          }
        >
          ✅ Finalizar
        </button>

      </div>

      {/* HISTORIAL */}

      <h2>Historial</h2>

      <div
        style={{
          background: "#fafafa",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 20,
          maxHeight: "250px",
          overflowY: "auto",
          overflowX: "hidden",
          marginBottom: "20px",
        }}
      >
        {ticket.history?.length ? (

          ticket.history
            .slice()
            .reverse()
            .map((item, index) => (

              <div
                key={index}
                style={{
                      marginBottom: 10,
                      paddingBottom: 10,
                      borderBottom: "1px solid #e5e5e5",
                      color: "#000",
                      fontSize: "14px",
                      lineHeight: "1.5",
                  }}
                >
                <b>{item.worker}</b>

                <br />

                {item.action}

                <br />

                <small>
                  {new Date(item.date).toLocaleString()}
                </small>
              </div>

            ))

        ) : (

          <p>No hay movimientos todavía.</p>

        )}
      </div>

      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: 30,
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Volver
      </button>
    </div>
  );
}