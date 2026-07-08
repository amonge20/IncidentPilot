"use client";

export default function SummaryBox({ summary }) {
  return (
    <>
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
        {summary || "No hay resumen disponible"}
      </div>
    </>
  );
}