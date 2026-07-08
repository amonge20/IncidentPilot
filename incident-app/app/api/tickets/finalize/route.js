import fs from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "tickets.json"
);

export async function POST(req){
    
  try{
    const {
      ticketId,
      worker,
      problem,
      solution,
      component,
      resolved,
      pendingReason,
    }=await req.json();

    const tickets=JSON.parse(
      fs.readFileSync(filePath,"utf8")
    );

    const index=tickets.findIndex(
      t=>t.id===ticketId
    );

    if(index===-1){
      return Response.json({
        success:false,
        message:"Incidencia no encontrada"
      });
    }

    tickets[index].workReport={
      problem,
      solution,
      component,
      resolved,
      pendingReason,
      worker:worker.name,
      finishedAt:new Date().toISOString(),
    };

    tickets[index].status=
      resolved
      ?"Finalizado"
      :"Pendiente";

    if(!tickets[index].history){
      tickets[index].history=[];
    }

    tickets[index].history.push({

      worker:worker.name,

      action:resolved
        ?"Ha finalizado la incidencia"
        :"La incidencia queda pendiente",
      date:new Date().toISOString(),
    });

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        tickets,
        null,
        2
      )
    );

    return Response.json({
      success:true
    });
  }

  catch(err){
    console.log(err);
    return Response.json({
      success:false,
      message:"Error al finalizar"
    });
  }
}