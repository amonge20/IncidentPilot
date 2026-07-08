"use client";

export default function SolutionSection({ form, setForm }) {
  return (
    <>
      <h3>2. ¿Qué solución has aplicado?</h3>

      <textarea
        rows={4}
        value={form.solution}
        onChange={(e) =>
          setForm({
            ...form,
            solution: e.target.value,
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