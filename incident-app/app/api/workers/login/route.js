import { getWorkers } from "../../../lib/workers";

export async function POST(req) {

  const { email, password } = await req.json();

  const workers = getWorkers();

  const worker = workers.find(
    w =>
      w.email === email &&
      w.password === password
  );

  if (!worker) {
    return Response.json({
      success: false,
      message: "Correo o contraseña incorrectos."
    });
  }

  return Response.json({
    success: true,
    worker
  });
}