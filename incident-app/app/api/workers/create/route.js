import { saveWorker } from "../../../lib/workers";

export async function POST(req) {

  const worker = await req.json();

  worker.id = "TEC-" + Date.now();

  worker.status = "Disponible";

  saveWorker(worker);

  return Response.json({
    success: true,
    worker,
  });
}