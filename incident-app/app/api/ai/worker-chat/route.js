import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "tickets.json");

export async function POST(req) {

    try {

        const {

            ticketId,

            message

        } = await req.json();

        const tickets = JSON.parse(
            fs.readFileSync(filePath,"utf8")
        );

        const index = tickets.findIndex(
            t=>t.id===ticketId
        );

        if(index===-1){

            return Response.json({
                success:false
            });

        }

        const ticket=tickets[index];

        if(!ticket.aiChat){

            ticket.aiChat=[];

        }

        ticket.aiChat.push({

            role:"worker",

            content:message

        });

        const response=await fetch(

            "https://api.groq.com/openai/v1/chat/completions",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${process.env.GROQ_API_KEY}`

                },

                body:JSON.stringify({

                    model:"llama-3.1-8b-instant",

                    temperature:0.3,

                    messages:[

                        {

                            role:"system",

                            content:`
Eres un técnico senior de soporte.

Estás ayudando al trabajador.

Información de la incidencia:

Resumen:

${ticket.summary}

Prioridad:

${ticket.priority}

Estado:

${ticket.status}

Responde únicamente sobre esta incidencia.

Da instrucciones claras y técnicas.
`
                        },
                        ...ticket.aiChat,
                        {
                            role:"user",
                            content:message
                        }
                    ]
                })
            }
        );

        const ai=await response.json();
        const answer=ai.choices[0].message.content;

        ticket.aiChat.push({
            role:"assistant",
            content:answer
        });

        fs.writeFileSync(
            filePath,
            JSON.stringify(tickets,null,2)
        );

        return Response.json({
            success:true,
            answer
        });

    } catch(err){
        console.error(err);
        return Response.json({
            success:false
        });
    }
}