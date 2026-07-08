"use client";

export default function ProblemSection({ form, setForm }) {
  return (
    <>
      <h3>1. ¿Qué problema tenía el cliente?</h3>

      <textarea
        rows={4}
        value={form.problem}
        onChange={(e) =>
          setForm({
            ...form,
            problem: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 10,
          marginTop: 10,
          marginBottom: 25,
        }}
      />
    </>
  );
}