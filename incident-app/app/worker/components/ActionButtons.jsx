"use client";

export default function ActionButtons({

  ticket,
  changeStatus,

}) {

  return (

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
            "/worker/incidencia/" +
            ticket.id +
            "/finalizar"
        }
      >
        ✅ Finalizar
      </button>
    </div>
  );
}