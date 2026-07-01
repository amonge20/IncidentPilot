"use client";

import { useEffect, useState } from "react";

export default function Trabajadores() {
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dni: "",
    cv: null,
    role: "",
    level: "",
    skills: "",
    experience: "",
  });
  // =========================
  // CARGAR TRABAJADORES
  // =========================

  const loadWorkers = async () => {
    const res = await fetch("/api/workers/list");
    const data = await res.json();
    setWorkers(data);
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // =========================
  // SUBIR CV
  // =========================

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      cv: file,
    }));
  };

  // =========================
  // ANALIZAR CV
  // =========================

  const analyzeCV = async () => {
    if (!formData.cv) {
      alert("Seleccione un CV.");
      return;
    }

    setLoadingAI(true);

    try {
      const form = new FormData();
      form.append("cv", formData.cv);

      const res = await fetch("/api/workers/analyze-cv", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || data.valid === false) {
        alert(data.error || "No se pudo analizar el CV.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        dni: data.dni || "",
        role: data.role || "",
        level: data.level || "",
        experience: data.experience || "",
        skills: data.skills?.join(", ") || "",
      }));

    } catch (error) {
      console.error(error);
      alert("Error analizando el CV.");
    } finally {
      setLoadingAI(false);
    }
  };

  // =========================
  // GUARDAR
  // =========================

  const saveWorker = async () => {
    const endpoint = "/api/workers/create";

    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    });

    loadWorkers();

    setShowModal(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
      dni: "",
      cv: null,
      role: "",
      level: "",
      skills: "",
      experience: "",
    });
  };

  // =========================
  // ELIMINAR
  // =========================

  const deleteWorker = async (id) => {
    if (!confirm("¿Eliminar trabajador?")) return;

    await fetch("/api/workers/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadWorkers();
  };

  return (
    <div style={styles.container}>
      <h1>👷 Gestión de Trabajadores</h1>

      <button
        style={styles.addButton}
        onClick={() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            dni: "",
            cv: null,
            role: "",
            level: "",
            skills: "",
            experience: "",
          });

          setShowModal(true);
        }}
      >
        ➕ Añadir trabajador
      </button>

      <div style={{ marginTop: 25 }}>
        {workers.map((worker) => (
          <div
            key={worker.id}
            style={styles.card}
          >
            <h3>{worker.name}</h3>

            <p>
              <b>Rol:</b> {worker.role}
            </p>

            <p>
              <b>Nivel:</b> {worker.level}
            </p>

            <p>
              <b>Experiencia:</b>{" "}
              {worker.experience} años
            </p>

            <p>
              <b>Skills:</b>{" "}
              {worker.skills}
            </p>

            <div style={styles.buttons}>
              <button
                style={styles.delete}
                onClick={() =>
                  deleteWorker(worker.id)
                }
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
                  
            <h2>Nuevo trabajador</h2>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFile}
            />

            <button
              onClick={analyzeCV}
              disabled={loadingAI}
            >
              {loadingAI
                ? "🤖 Analizando CV..."
                : "🤖 Analizar CV"}
            </button>

            {formData.name && (
              <>
                <hr />

                <h3>Datos detectados</h3>

                <input
                  value={formData.name}
                  readOnly
                />

                <input
                  value={formData.email}
                  readOnly
                />

                <input
                  value={formData.phone}
                  readOnly
                />

                <input
                  value={formData.dni}
                  readOnly
                />

                <input
                  value={formData.role}
                  readOnly
                />

                <input
                  value={formData.level}
                  readOnly
                />

                <input
                  value={formData.experience}
                  readOnly
                />

                <textarea
                  value={formData.skills}
                  readOnly
                />
              </>
            )}

            <div style={styles.buttons}>
              {formData.name && (
                <button
                  style={styles.save}
                  onClick={saveWorker}
                >
                  💾 Guardar trabajador
                </button>
              )}

              <button
                style={styles.cancel}
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    background: "#f5f5f5",
    minHeight: "100vh",
    color: "black",
  },

  addButton: {
    padding: 12,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    border: "1px solid #ddd",
  },

  buttons: {
    display: "flex",
    gap: 10,
    marginTop: 15,
  },

  edit: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
  },

  delete: {
    background: "#d60000",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
  },

  save: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
  },

  cancel: {
    background: "#555",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 25,
    borderRadius: 10,
    width: 500,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};