"use client";

export default function TicketModal({

  ticket,
  workers,

  assignedWorker,
  setAssignedWorker,

  assignWorker,
  close,

}) {

  return (

    <div style={styles.overlay}>

      <div style={styles.modal}>

        <h2>{ticket.id}</h2>

        <p><b>Usuario:</b> {ticket.user}</p>

        <p><b>Empresa:</b> {ticket.company || "No indicada"}</p>

        <p><b>Email:</b> {ticket.email}</p>

        <p><b>Teléfono:</b> {ticket.phone || "No indicado"}</p>

        <p><b>Ubicación:</b> {ticket.location}</p>

        <h3
          style={{
            marginTop: 20,
            marginBottom: 15,
          }}
        >
          💬 Conversación
        </h3>

        <div style={styles.chat}>

          {ticket.conversation?.map((msg, index) => (

            <div
              key={index}
              style={{
                marginBottom: 15,
              }}
            >

              <strong>

                {msg.role === "user"

                  ? `${ticket.user} (Usuario)`

                  : "IA"}

              </strong>

              <div
                style={{
                  marginTop: 5,
                  marginLeft: 10,
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <hr
          style={{
            marginTop: 25,
            marginBottom: 20,
          }}
        />

        <h3>📜 Historial del trabajador</h3>

        <div
          style={{
            background: "#fafafa",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            maxHeight: "250px",
            overflowY: "auto",
            marginBottom: "20px",
          }}
        >

          {ticket.history?.length ? (
            ticket.history
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    paddingBottom: 10,
                    marginBottom: 10,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <b>{item.worker}</b>
                  <br />
                  {item.action}
                  <br />

                  <small
                    style={{
                      color: "#666",
                    }}
                  >
                    {new Date(item.date).toLocaleString()}
                  </small>
                </div>
              ))
          ) : (
            <p>No hay movimientos todavía.</p>
          )}
        </div>

        <select
          value={assignedWorker}
          onChange={(e) =>
            setAssignedWorker(e.target.value)
          }
          style={styles.select}
        >
          <option value="">
            Selecciona un trabajador
          </option>

          {workers.map((worker) => (
            <option
              key={worker.id}
              value={worker.id}
            >
              {worker.name} - {worker.role} ({worker.level})
            </option>
          ))}
        </select>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >

          <button
            onClick={assignWorker}
            style={styles.assignBtn}
          >

            {ticket.assignedWorker
              ? "🔄 Reasignar trabajador"
              : "👷 Asignar trabajador"}
          </button>

          <button
            onClick={close}
            style={styles.closeBtn}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    width: "90%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "10px",
    padding: "25px",
    color: "#111",
  },

  chat: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    maxHeight: "300px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
  },

  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
  },

  assignBtn: {
    flex: 1,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
  },

  closeBtn: {
    flex: 1,
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
  },
};