"use client";

import TicketCard from "./TicketCard";

export default function ActiveTickets({
  tickets,
  onView,
  onDelete,
}) {

  return (
    <>
      <h2
        style={{
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        🚨 Incidencias activas
      </h2>

      {tickets.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            color: "#777",
          }}
        >
          No hay incidencias activas.
        </div>
      ) : (
        tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onView={onView}
            onDelete={onDelete}
          />
        ))
      )}
    </>
  );
}