import { getWorkers } from "../../../lib/workers";

export async function POST(req) {

    const { email } = await req.json();

    const workers = getWorkers();

    const worker = workers.find(
        w => w.email.toLowerCase() === email.toLowerCase()
    );

    if (!worker) {

        return Response.json({
            success:false,
            message:"Trabajador no encontrado"
        });

    }

    return Response.json({
        success:true,
        worker
    });

}