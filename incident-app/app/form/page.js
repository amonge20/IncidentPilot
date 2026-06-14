"use client";

import { useState } from "react";

export default function FormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    address: "",
  });

  const [conversation, setConversation] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // ENVIAR INCIDENCIA A IA
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedConversation = [
      {
        role: "user",
        content: `
        Nombre: ${formData.name}
        Email: ${formData.email}

        Ubicación:
        ${formData.address}

        Incidencia:
        ${formData.message}
        `,
      },
    ];

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedConversation }),
    });

    const data = await res.json();

    setConversation([
      ...updatedConversation,
      { role: "assistant", content: data.result },
    ]);

    setAiResponse(data.result);
    setShowPopup(true);
    setLoading(false);
  };

  // =========================
  // FOLLOW UP IA
  // =========================
  const handleFollowUp = async () => {
    if (!formData.message.trim()) return;

    setLoading(true);

    const updatedConversation = [
      ...conversation,
      { role: "user", content: formData.message },
    ];

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedConversation }),
    });

    const data = await res.json();

    setConversation([
      ...updatedConversation,
      { role: "assistant", content: data.result },
    ]);

    setAiResponse(data.result);
    setFormData((prev) => ({ ...prev, message: "" }));

    setLoading(false);
  };

  // =========================
  // 🚨 ESCALAR INCIDENCIA (TICKET REAL)
  // =========================
  const createTicket = async () => {
    const res = await fetch("/api/tickets/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: formData.name,
        email: formData.email,
        location: {
          address: formData.address,
        },
        conversation,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`🚨 Ticket creado correctamente`);
      window.location.href = "/admin/incidencias";

      setShowPopup(false);
      setConversation([]);
      setAiResponse("");

      setFormData({
        name: "",
        email: "",
        message: "",
        address: "",
      });
    } else {
      alert(data.message || "No se pudo crear el ticket");
    }
  };

  // =========================
  // ✔ SOLUCIONADO
  // =========================
  const handleSolved = () => {
    alert("✅ Incidencia marcada como solucionada");

    setShowPopup(false);
    setConversation([]);
    setAiResponse("");

    setFormData({
      name: "",
      email: "",
      message: "",
      address: "",
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sistema de Incidencias con IA</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        {/* 📍 UBICACIÓN MANUAL */}
        <textarea
          name="address"
          placeholder="Ubicación (ej: Calle Mayor 12, Barcelona)"
          value={formData.address}
          onChange={handleChange}
          style={styles.textarea}
        />

        <textarea
          name="message"
          placeholder="Describe tu incidencia..."
          value={formData.message}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          {loading ? "Procesando..." : "Enviar incidencia"}
        </button>
      </form>

      {/* =========================
          POPUP IA
      ========================= */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2>🤖 Asistente IA</h2>

            <pre style={styles.aiBox}>{aiResponse}</pre>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={styles.textareaAI}
            />

            <button onClick={handleFollowUp} style={styles.button}>
              Enviar respuesta
            </button>

            <div style={styles.actionsRow}>
              <button
                onClick={createTicket}
                style={styles.escalateBtn}
              >
                🚨 Escalar incidencia
              </button>

              <button
                onClick={handleSolved}
                style={styles.closeBtn}
              >
                ✅ Solucionado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================
// 🎨 ESTILOS
// =========================
const styles = {
  container: {
    maxWidth: "650px",
    margin: "60px auto",
    fontFamily: "Arial",
    padding: "20px",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "500px",
    fontSize: "14px",
  },

  textarea: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    minHeight: "160px",
    width: "100%",
    fontSize: "14px",
    resize: "vertical",
  },

  textareaAI: {
    padding: "12px",
    border: "2px solid #000",
    borderRadius: "12px",
    Height: "500px",
    width: "100%",
    marginTop: "10px",
    backgroundColor: "#fff",
    color: "#111",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    marginBottom: "15px",
  },

  button: {
    padding: "10px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "15px",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    color: "#000",
  },

  aiBox: {
    backgroundColor: "#f7f7f7",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    whiteSpace: "pre-wrap",
    overflowY: "auto",
    maxHeight: "300px",
    marginBottom: "15px",
  },

  actionsRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  escalateBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#d60000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  closeBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
