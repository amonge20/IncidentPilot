"use client";

import { useState } from "react";

export default function FormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: formData.message,
      }),
    });

    const data = await res.json();

    setAiResponse(data.result);
    setShowPopup(true);
    setLoading(false);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sistema de Incidencias con IA</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Nombre"
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

        <textarea
          name="message"
          placeholder="Describe tu incidencia..."
          value={formData.message}
          onChange={handleChange}
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.button}>
          {loading ? "Analizando con IA..." : "Enviar incidencia"}
        </button>
      </form>

      {/* POPUP IA */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2>🤖 Análisis de IA</h2>
            <pre style={styles.aiBox}>{aiResponse}</pre>

            <button onClick={() => setShowPopup(false)} style={styles.closeBtn}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "60px auto",
    fontFamily: "Arial",
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
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minHeight: "120px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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
    width: "420px",
    textAlign: "center",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    color: "#000000",
  },
  aiBox: {
    textAlign: "left",
    whiteSpace: "pre-wrap",
    marginTop: "10px",
    overflowY: "auto",
    maxHeight: "50vh",
    paddingRight: "10px",
  },
  closeBtn: {
    marginTop: "15px",
    padding: "8px 12px",
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
