import { saveWorker } from "../../../lib/workers";

export async function POST(req) {

  const worker = await req.json();

  worker.id = "TEC-" + Date.now();

  worker.status = "Disponible";

  // Si por algún motivo no viene contraseña
  // se crea una temporal
  if (!worker.password) {
    worker.password =
      Math.random().toString(36).slice(-8) + "!";
  }

  saveWorker(worker);

  return Response.json({
    success: true,
    worker,
  });
}