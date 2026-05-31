export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Eres un técnico de soporte. Y le das todas las soluciones posibles claras y sencillas."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const text = await response.text();
    console.log("RAW GROQ RESPONSE:", text);

    const data = JSON.parse(text);

    const result =
      data?.choices?.[0]?.message?.content ??
      data?.error?.message ??
      "Sin respuesta real de la IA";

    return Response.json({ result });

  } catch (error) {
    console.error("ERROR:", error);

    return Response.json({
      result: "Error en el servidor de IA"
    });
  }
}