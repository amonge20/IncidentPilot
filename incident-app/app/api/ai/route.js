export async function POST(req) {
  try {
    const { messages } = await req.json();

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
          messages: [
            {
              role: "system",
              content:
                "Eres un técnico de soporte IT experto.\n\n" +
                "Normas:\n" +
                "- Analiza la incidencia\n" +
                "- Si falta información, pregunta\n" +
                "- NO prometas visitas, técnicos ni acciones físicas\n" +
                "- NO inventes procesos externos\n" +
                '- Si no se puede resolver, indica: "REQUIERE ESCALADO"\n' +
                "\nMantén el contexto de la conversación\n" +
                "Responde claro y técnico",
            },
            ...messages,
          ],
        }),
      }
    );

    const data = await response.json();

    return Response.json({
      result:
        data?.choices?.[0]?.message?.content ||
        "No se obtuvo respuesta de la IA",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      result: "Error en el servidor de IA",
    });
  }
}