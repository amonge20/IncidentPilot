"use client";

import TicketCard from "./TicketCard";

export default function FinishedTickets({
  tickets,
  onView,
}) {

  return (
    <>
      <hr
        style={{
          margin: "40px 0",
        }}
      />

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        ✅ Incidencias finalizadas
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
          No hay incidencias finalizadas.
        </div>
      ) : (
        tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onView={onView}
          />
        ))
      )}
    </>
  );
}