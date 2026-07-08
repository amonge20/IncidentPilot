"use client";

export default function Filters({

  workers,

  priorityFilter,
  workerFilter,
  statusFilter,

  setPriorityFilter,
  setWorkerFilter,
  setStatusFilter,

}) {

  return (

    <div
      style={{
        display: "flex",
        gap: "15px",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "25px",
        flexWrap: "wrap",
      }}
    >

      <button
        style={styles.addWorkerButton}
        onClick={() =>
          window.location.href = "/admin/trabajadores"
        }
    >
        👷 Trabajadores
      </button>

      {/* PRIORIDAD */}
      <select
        value={priorityFilter}
        onChange={(e) =>
          setPriorityFilter(e.target.value)
        }
        style={styles.filter}>
        <option value="all">
          Todas las prioridades
        </option>

        <option value="high">
          🔴 Alta
        </option>

        <option value="medium">
          🟠 Media
        </option>

        <option value="low">
          🟢 Baja
        </option>
      </select>

      {/* TRABAJADOR */}

      <select
        value={workerFilter}
        onChange={(e) =>
          setWorkerFilter(e.target.value)
        }
        style={styles.filter}
      >

        <option value="all">
          Todos los trabajadores
        </option>

        {workers.map((worker) => (
          <option
            key={worker.id}
            value={worker.id}
          >
            {worker.name}
          </option>
        ))}
      </select>

      {/* ESTADO */}

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value)
        }
        style={styles.filter}>

        <option value="all">
          Todos los estados
        </option>

        <option value="OPEN">
          📋 Asignada
        </option>

        <option value="En camino">
          🚗 En camino
        </option>

        <option value="En cliente">
          📍 En cliente
        </option>

        <option value="En progreso">
          🛠 En progreso
        </option>

        <option value="Pendiente">
          ⏳ Pendiente
        </option>

        <option value="Finalizado">
          ✅ Finalizado
        </option>
      </select>
    </div>
  );
}

const styles = {
  filter: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "220px",
    background: "#fff",
    cursor: "pointer",
  },

  addWorkerButton: {
    padding: "10px 18px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};