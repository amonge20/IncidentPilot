import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "tickets.json");

export async function POST(req) {

    const {
        ticketId,
        status,
        workerName,
        action
    } = await req.json();

    const tickets = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    const index = tickets.findIndex(
        t => t.id === ticketId
    );

    if(index === -1){
        return Response.json({
            success:false
        });
    }

    // Cambiar estado
    tickets[index].status = status;

    // Crear historial si no existe
    if(!tickets[index].history){
        tickets[index].history = [];
    }

    // Añadir movimiento
    tickets[index].history.push({
        worker: workerName,
        action,
        status,
        date:new Date().toISOString()
    });

    fs.writeFileSync(
        filePath,
        JSON.stringify(tickets,null,2)
    );

    return Response.json({
        success:true,
        ticket:tickets[index]
    });
}