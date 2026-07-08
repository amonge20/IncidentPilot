"use client";

export default function WorkerHeader({ ticket }) {
  return (
    <>
      <h1>Incidencia {ticket.id}</h1>
      <hr />
    </>
  );
}