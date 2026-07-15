"use client";

export default function WorkerHeader({ worker }) {
  function logout() {
    localStorage.removeItem("worker");
    window.location.href = "/worker/login";
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        background: "#1b1b1b",
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>
          👷 Bienvenido, {worker?.name}
        </h2>

        <p style={{ margin: "8px 0 0 0" }}>
          <b>Rol:</b> {worker?.role}
        </p>

        <p style={{ margin: "4px 0 0 0" }}>
          <b>Estado:</b> {worker?.status}
        </p>
      </div>

      <button
        onClick={logout}
        style={{
          background: "#d32f2f",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🚪 Cerrar sesión
      </button>
    </div>
  );
}