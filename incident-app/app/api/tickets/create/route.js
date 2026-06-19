import { saveTicket } from "../../../lib/tickets";

export async function POST(req) {
  try {
    const { user, company, email, location, conversation } = await req.json();

    const text = JSON.stringify(conversation).toLowerCase();

    const badWords = ["idiota", "estúpido", "imbecil", "tonto", "solucionamelo", "solucion"];
    const isAggressive = badWords.some((w) => text.includes(w));

    let priority = "low";

    if (text.includes("no funciona") || text.includes("caído")) {
      priority = "medium";
    }

    if (text.includes("urgente") || text.includes("crítico")) {
      priority = "high";
    }

    if (isAggressive) priority = "high";

    const ticket = {
      id: "INC-" + Date.now(),
      user,
      company, 
      email,
      location: location?.address || "",
      conversation,
      priority,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    saveTicket(ticket); 

    return Response.json({
      success: true,
      ticket,
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: "Error creando ticket",
    });
  }
}