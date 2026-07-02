import { getWorkerById } from "../../../lib/workers";
import { assignWorker } from "../../../lib/tickets";

export async function POST(req) {

  try {

    const { ticketId, workerId } = await req.json();

    const worker = getWorkerById(workerId);

    if (!worker) {
      return Response.json({
        success: false,
        message: "Trabajador no encontrado."
      });
    }

    const ok = assignWorker(ticketId, worker);

    if (!ok) {
      return Response.json({
        success: false,
        message: "Incidencia no encontrada."
      });
    }

    return Response.json({
      success: true,
      worker
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      message: "Error asignando trabajador."
    });

  }

}