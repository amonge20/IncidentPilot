"use client";

export default function ResolutionSection({ form, setForm }) {
  return (
    <>
      <h3>4. ¿La incidencia ha quedado resuelta?</h3>

      <select
        value={form.resolved}
        onChange={(e) =>
          setForm({
            ...form,
            resolved: e.target.value === "true",
          })
        }
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          marginTop: 10,
          marginBottom: 25,
        }}
      >
        <option value={true}>Sí</option>
        <option value={false}>No</option>
      </select>

      {!form.resolved && (
        <>
          <h3>¿Qué queda pendiente?</h3>

          <textarea
            rows={4}
            value={form.pendingReason}
            onChange={(e) =>
              setForm({
                ...form,
                pendingReason: e.target.value,
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
      )}
    </>
  );
}