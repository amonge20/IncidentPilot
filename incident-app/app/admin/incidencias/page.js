"use client";

import { useEffect, useState } from "react";

import Filters from "./components/Filters";
import ActiveTickets from "./components/ActiveTickets";
import FinishedTickets from "./components/FinishedTickets";
import TicketModal from "./components/TicketModal";

export default function AdminIncidencias() {

  // =============================
  // ESTADOS
  // =============================

  const [tickets, setTickets] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("all");
  const [workerFilter, setWorkerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // =============================
  // CARGAR TICKETS
  // =============================

  async function loadTickets() {

    const res = await fetch("/api/tickets/list");
    const data = await res.json();

    setTickets(data);

  }

  // =============================
  // CARGAR TRABAJADORES
  // =============================

  useEffect(() => {

    loadTickets();

    fetch("/api/workers/list")
      .then((res) => res.json())
      .then((data) => setWorkers(data));

  }, []);

  // =============================
  // ELIMINAR INCIDENCIA
  // =============================

  async function deleteTicket(id) {

    if (!window.confirm("¿Seguro que quieres eliminar la incidencia?")) {
      return;
    }

    await fetch("/api/tickets/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }

  // =============================
  // ASIGNAR TRABAJADOR
  // =============================

  async function assignWorker() {
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

    if (!data.success) {
      alert(data.message);
      return;
    }
    alert("Trabajador asignado correctamente");
    loadTickets();
    setSelectedTicket(null);
  }

  // =============================
  // FILTROS
  // =============================

  const filteredTickets = tickets.filter((t) => {

    const priorityOk =
      priorityFilter === "all" ||
      t.priority === priorityFilter;

    const workerOk =
      workerFilter === "all" ||
      t.assignedWorker?.id === workerFilter;

    const statusOk =
      statusFilter === "all" ||
      t.status === statusFilter;
    return priorityOk && workerOk && statusOk;
  });

  const activeTickets = filteredTickets.filter(
    (t) => t.status !== "Finalizado"
  );

  const finishedTickets = filteredTickets.filter(
    (t) => t.status === "Finalizado"
  );

  // =============================
  // RENDER
  // =============================

  return (
    <div style={styles.container}>
      <h1>📋 Incidencias</h1>
      <Filters
        workers={workers}
        priorityFilter={priorityFilter}
        workerFilter={workerFilter}
        statusFilter={statusFilter}
        setPriorityFilter={setPriorityFilter}
        setWorkerFilter={setWorkerFilter}
        setStatusFilter={setStatusFilter}
      />

      <ActiveTickets
        tickets={activeTickets}
        onView={(ticket) => {
          setSelectedTicket(ticket);
          setAssignedWorker(
            ticket.assignedWorker?.id || ""
          );
        }}
        onDelete={deleteTicket}
      />

      <FinishedTickets
        tickets={finishedTickets}
        onView={(ticket) => {
          setSelectedTicket(ticket);
          setAssignedWorker(
            ticket.assignedWorker?.id || ""
          );
        }}
      />

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          workers={workers}
          assignedWorker={assignedWorker}
          setAssignedWorker={setAssignedWorker}
          assignWorker={assignWorker}
          close={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    color: "#111",
  },
};