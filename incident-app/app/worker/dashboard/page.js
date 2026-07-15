"use client";

import { useEffect, useState } from "react";

import WorkerHeader from "../components/WorkerHeader";
import StatsCards from "../components/StatsCards";

export default function Dashboard() {

  const [tickets, setTickets] = useState([]);
  const [worker, setWorker] = useState(null);

  useEffect(() => {

    const loggedWorker = JSON.parse(
      localStorage.getItem("worker")
    );

    if (!loggedWorker) {
      window.location.href = "/worker/login";
      return;
    }

    setWorker(loggedWorker);

    loadTickets(loggedWorker.id);

  }, []);

  async function loadTickets(workerId) {

    try {

      const res = await fetch("/api/tickets/list");

      const data = await res.json();

      const mine = data.filter(
        t => t.assignedWorker?.id === workerId
      );

      setTickets(mine);

    } catch (err) {

      console.error(err);

    }

  }

  return (

    <div style={styles.container}>

      <WorkerHeader worker={worker} />

      <StatsCards tickets={tickets} />

      <h2
        style={{
          color: "#000",
          marginBottom: "25px",
        }}
      >
        📋 Mis incidencias
      </h2>

      {
        tickets.length === 0 ? (

          <div style={styles.emptyCard}>

            <h3>No tienes incidencias asignadas.</h3>

          </div>

        ) : (

          tickets.map(ticket => (

            <div
              key={ticket.id}
              style={styles.card}
            >

              <h3 style={styles.title}>
                {ticket.id}
              </h3>

              <p style={styles.text}>
                <b>Cliente:</b> {ticket.user}
              </p>

              <p style={styles.text}>
                <b>Empresa:</b>{" "}
                {ticket.company || "No indicada"}
              </p>

              <p style={styles.text}>
                <b>Prioridad:</b> {ticket.priority}
              </p>

              <p style={styles.text}>
                <b>Estado:</b> {ticket.status}
              </p>

              <button
                style={styles.openButton}
                onClick={() =>
                  window.location.href =
                    "/worker/incidencia/" + ticket.id
                }
              >
                👁 Abrir incidencia
              </button>

            </div>

          ))

        )
      }

    </div>

  );

}

const styles = {

  container: {
    padding: "30px",
    background: "#f5f5f5",
    minHeight: "100vh",
  },

  emptyCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    color: "#333",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  title: {
    color: "#000",
    marginBottom: "10px",
  },

  text: {
    color: "#000",
    marginBottom: "8px",
  },

  openButton: {
    marginTop: "15px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

};