"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function FinalizarIncidencia() {

  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    problem: "",
    solution: "",
    component: "",
    resolved: true,
    pendingReason: "",
  });

  async function finishIncident() {
    setLoading(true);

    const worker = JSON.parse(
      localStorage.getItem("worker")
    );

    const res = await fetch(
      "/api/tickets/finalize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: id,
          worker,
          ...form,
        }),
      }
    );

    const data = await res.json();

    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }
    alert("Incidencia guardada correctamente");
    router.push("/worker/dashboard");
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 30,
      }}
    >

      <h1>Finalizar incidencia</h1>
      <hr />

      <h3>1. ¿Qué problema tenía el cliente?</h3>

      <textarea
        value={form.problem}
        onChange={(e)=>
          setForm({
            ...form,
            problem:e.target.value,
          })

        }

        rows={4}
        style={styles.textarea}
      />

      <h3>2. ¿Qué solución has aplicado?</h3>

      <textarea
        value={form.solution}
        onChange={(e)=>
          setForm({
            ...form,
            solution:e.target.value,
          })
        }

        rows={4}
        style={styles.textarea}
      />

      <h3>3. ¿Se ha sustituido algún componente?</h3>

      <input
        value={form.component}
        placeholder="Ej: Switch Cisco"
        onChange={(e)=>
          setForm({
            ...form,
            component:e.target.value,
          })
        }
        style={styles.input}
      />

      <h3>4. ¿La incidencia ha quedado resuelta?</h3>

      <select
        value={form.resolved}
        onChange={(e)=>
          setForm({
            ...form,
            resolved:e.target.value==="true"
          })
        }
        style={styles.input}
      >
        <option value={true}>Sí</option>
        <option value={false}>No</option>
      </select>

      {
        !form.resolved && (
          <>
            <h3>¿Qué queda pendiente?</h3>

            <textarea
              rows={4}
              value={form.pendingReason}
              onChange={(e)=>
                setForm({
                  ...form,
                  pendingReason:e.target.value
                })
              }
              style={styles.textarea}
            />
          </>
        )
      }

      <div
        style={{
          display:"flex",
          gap:20,
          marginTop:40,
        }}
      >

        <button
          style={styles.save}
          disabled={loading}
          onClick={finishIncident}
        >
          {
            loading
            ? "Guardando..."
            : "Finalizar"
          }
        </button>

        <button
          style={styles.cancel}
          onClick={()=>router.back()}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

const styles={
    input:{
        width:"100%",
        padding:"12px",
        borderRadius:"8px",
        marginTop:"10px",
        marginBottom:"25px",
    },

    textarea:{
        width:"100%",
        padding:"15px",
        borderRadius:"10px",
        marginTop:"10px",
        marginBottom:"25px",
    },

    save:{
        background:"#2e7d32",
        color:"#fff",
        padding:"12px 25px",
        border:"none",
        borderRadius:"8px",
        cursor:"pointer",
    },

    cancel:{
        background:"#d32f2f",
        color:"#fff",
        padding:"12px 25px",
        border:"none",
        borderRadius:"8px",
        cursor:"pointer",
    }
};