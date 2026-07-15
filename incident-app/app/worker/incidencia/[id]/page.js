"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import TicketInfo from "../../components/TicketInfo";
import SummaryBox from "../../components/SummaryBox";
import ActionButtons from "../../components/ActionButtons";
import TicketHistory from "../../components/TicketHistory";
import WorkerAIChat from "../../components/WorkerAIChat";

export default function WorkerIncidencia() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    loadTicket();
  }, [id]);

  async function loadTicket() {
    try {
      const res = await fetch("/api/tickets/get/" + id);

      if (!res.ok) {
        return;
      }

      const data = await res.json();

      setTicket(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  }

  async function changeStatus(status, action) {
    try {
      const worker = JSON.parse(
        localStorage.getItem("worker")
      );

      const res = await fetch(
        "/api/tickets/update-status",
        {
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
        }
      );

      const data = await res.json();

      if (data.success) {

        loadTicket();

      } else {

        alert("No se pudo actualizar.");

      }

    } catch (err) {

      console.error(err);

      alert("Ha ocurrido un error.");

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

      <TicketInfo ticket={ticket} />

      <SummaryBox summary={ticket.summary} />

      <ActionButtons
        ticket={ticket}
        changeStatus={changeStatus}
      />

      <TicketHistory history={ticket.history} />
      
      <WorkerAIChat ticket={ticket} />

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