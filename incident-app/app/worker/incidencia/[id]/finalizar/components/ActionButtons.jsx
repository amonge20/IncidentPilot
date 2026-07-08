"use client";

export default function ActionButtons({
  loading,
  finishIncident,
  router,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginTop: 40,
      }}
    >
      <button
        onClick={finishIncident}
        disabled={loading}
        style={{
          background: "#2e7d32",
          color: "#fff",
          padding: "12px 25px",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Guardando..." : "Finalizar"}
      </button>

      <button
        onClick={() => router.back()}
        style={{
          background: "#d32f2f",
          color: "#fff",
          padding: "12px 25px",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Cancelar
      </button>
    </div>
  );
}