export async function POST(req) {
  try {
    const { user, email, location, conversation } = await req.json();

    // 🧠 Validación simple de abuso
    const text = JSON.stringify(conversation).toLowerCase();

    const badWords = ["idiota", "estúpido", "puta", "mierda"];

    const isAggressive = badWords.some((w) => text.includes(w));

    if (isAggressive) {
      return Response.json({
        success: false,
        message: "⚠️ Ticket rechazado por comportamiento inapropiado",
      });
    }

    // 📦 Simulación de ticket SaaS
    const ticket = {
      id: "TCK-" + Date.now(),
      user,
      email,
      location,
      conversation,
      status: "OPEN",
    };

    console.log("📩 NUEVO TICKET:", ticket);

    return Response.json({
      success: true,
      assignedTechnician: "Tech-Support Level 1",
      ticket,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Error creando ticket",
    });
  }
}