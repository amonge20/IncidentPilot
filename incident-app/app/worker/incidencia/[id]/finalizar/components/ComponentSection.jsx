"use client";

export default function ComponentSection({ form, setForm }) {
  return (
    <>
      <h3>3. ¿Se ha sustituido algún componente?</h3>

      <input
        value={form.component}
        placeholder="Ej: Switch Cisco"
        onChange={(e) =>
          setForm({
            ...form,
            component: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          marginTop: 10,
          marginBottom: 25,
        }}
      />
    </>
  );
}