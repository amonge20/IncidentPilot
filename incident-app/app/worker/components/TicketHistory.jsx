"use client";

export default function TicketHistory({ history }) {
  return (
    <>
      <h2>Historial</h2>

      <div
        style={{
          background: "#fafafa",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 20,
          maxHeight: "250px",
          overflowY: "auto",
          overflowX: "hidden",
          marginBottom: "20px",
        }}
      >
        {history?.length ? (
          history
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 10,
                  paddingBottom: 10,
                  borderBottom: "1px solid #e5e5e5",
                  color: "#000",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                <b>{item.worker}</b>

                <br />

                {item.action}

                <br />

                <small>
                  {new Date(item.date).toLocaleString()}
                </small>
              </div>
            ))
        ) : (
          <p>No hay movimientos todavía.</p>
        )}
      </div>
    </>
  );
}