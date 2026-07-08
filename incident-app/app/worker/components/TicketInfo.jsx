"use client";

import StatusBadge from "./StatusBadge";

export default function TicketInfo({ ticket }) {

  return (
    <>
      <p><b>Cliente:</b> {ticket.user}</p>
      <p><b>Empresa:</b> {ticket.company}</p>
      <p><b>Email:</b> {ticket.email}</p>
      <p><b>Dirección:</b> {ticket.location}</p>
      <p><b>Prioridad:</b> {ticket.priority}</p>
      <p>
        <b>Estado:</b>{" "}
        <StatusBadge status={ticket.status} />
      </p>
    </>
  );
}