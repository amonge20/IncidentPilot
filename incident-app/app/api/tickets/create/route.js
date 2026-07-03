import { saveTicket } from "../../../lib/tickets";

export async function POST(req) {
  try {
    const {
      user,
      company,
      email,
      phone,
      location,
      conversation,
    } = await req.json();

    // Convertimos la conversación a texto
    const conversationText = conversation
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    // IA (Groq)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: `
Eres un técnico de Service Desk.

Analiza la conversación del cliente.

Devuelve ÚNICAMENTE un JSON válido con este formato:

{
  "priority":"high | medium | low",
  "summary":"Resumen técnico de la incidencia"
}

Normas:

- El resumen debe tener entre 2 y 5 líneas.
- No incluyas el nombre del cliente.
- No incluyas el correo.
- No incluyas el teléfono.
- No incluyas la dirección.
- Resume únicamente el problema técnico.
- No escribas texto fuera del JSON.
              `,
            },
            {
              role: "user",
              content: conversationText,
            },
          ],
        }),
      }
    );

    const ai = await response.json();

    const content = ai?.choices?.[0]?.message?.content;

    let result = {
      priority: "low",
      summary: "No se pudo generar un resumen.",
    };

    try {
      result = JSON.parse(content);
    } catch (e) {
      console.log("Respuesta IA:", content);
    }

    const ticket = {
      id: "INC-" + Date.now(),
      user,
      company,
      email,
      phone,
      location: location?.address || "",
      conversation,
      summary: result.summary,
      priority: result.priority,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    saveTicket(ticket);

    return Response.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Error creando ticket",
    });
  }
}