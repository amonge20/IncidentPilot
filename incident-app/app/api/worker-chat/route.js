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
      fs.readFileSync(filePath, "utf8")
    );

    const index = tickets.findIndex(
      t => t.id === ticketId
    );

    if (index === -1) {

      return Response.json({
        success: false,
        message: "Incidencia no encontrada."
      });

    }

    const ticket = tickets[index];

    if (!ticket.aiChat) {
      ticket.aiChat = [];
    }

    // Guardar mensaje del trabajador
    ticket.aiChat.push({
      role: "user",
      content: message
    });

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },

        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: `
Eres un técnico Senior de soporte IT.

Estás ayudando únicamente al trabajador.

Información de la incidencia:

ID:
${ticket.id}

Cliente:
${ticket.user}

Empresa:
${ticket.company}

Resumen:
${ticket.summary}

Prioridad:
${ticket.priority}

Estado:
${ticket.status}

Conversación del cliente:

${ticket.conversation
  ?.map(c => `${c.role}: ${c.content}`)
  .join("\n")}

Historial:

${ticket.history
  ?.map(h => `${h.worker}: ${h.action}`)
  .join("\n")}

Responde únicamente al trabajador.

Da instrucciones claras, paso a paso y técnicas.

Si el resumen está vacío, dedúcelo utilizando la conversación del cliente.
`
            },
            ...ticket.aiChat
          ]
        })
      }
    );

    const ai = await response.json();

    console.log(ai);

    if (!ai.choices) {
      return Response.json({
        success: false,
        message: ai.error?.message || "Error de la IA"
      });
    }

    const answer = ai.choices[0].message.content;

    ticket.aiChat.push({
      role: "assistant",
      content: answer
    });

    fs.writeFileSync(
      filePath,
      JSON.stringify(tickets, null, 2)
    );

    return Response.json({
      success: true,
      answer
    });
  }

  catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      message: err.message
    });
  }
}