"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import ComponentSection from "./components/ComponentSection";
import ResolutionSection from "./components/ResolutionSection";
import ActionButtons from "./components/ActionButtons";
import SignatureBox from "./components/SignatureBox";

export default function FinalizarIncidencia() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [workerSignature, setWorkerSignature] = useState("");
  const [clientSignature, setClientSignature] = useState("");

  const [form, setForm] = useState({
    problem: "",
    solution: "",
    component: "",
    resolved: true,
    pendingReason: "",
  });

  async function finishIncident() {
    if (!workerSignature) {
      alert("Debe firmar el trabajador.");
      return;
    }

    if (!clientSignature) {
      alert("Debe firmar el cliente.");
      return;
    }

    setLoading(true);

    try {
      const worker = JSON.parse(
        localStorage.getItem("worker")
      );

      const res = await fetch("/api/tickets/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: id,
          worker,
          ...form,

          workerSignature,
          clientSignature,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      // ===============================
      // GENERAR PDF
      // ===============================

      const pdfRes = await fetch("/api/tickets/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: id,
        }),
      });

      const pdf = await pdfRes.json();

      if (!pdf.success) {
        alert("La incidencia se ha guardado, pero no se pudo generar el PDF.");
      } else {
        console.log("PDF generado:", pdf.file);
      }

      alert("Incidencia guardada correctamente");
      router.push("/worker/dashboard");

    } catch (err) {
      console.error(err);
      alert("Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
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

      <ProblemSection
        form={form}
        setForm={setForm}
      />

      <SolutionSection
        form={form}
        setForm={setForm}
      />

      <ComponentSection
        form={form}
        setForm={setForm}
      />

      <ResolutionSection
        form={form}
        setForm={setForm}
      />

      <SignatureBox
        title="✍ Firma del trabajador"
        onSave={setWorkerSignature}
      />

      <SignatureBox
          title="✍ Firma del cliente"
          onSave={setClientSignature}
      />

      <ActionButtons
        loading={loading}
        finishIncident={finishIncident}
        router={router}
      />
    </div>
  );
}