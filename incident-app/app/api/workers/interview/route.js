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
                "Eres un especialista en Recursos Humanos del sector IT.\n\n" +

                "Tu misión es realizar una entrevista técnica a un nuevo trabajador.\n\n" +

                "Debes hacer UNA pregunta cada vez.\n" +

                "Preguntas obligatorias:\n" +
                "- Nombre completo\n" +
                "- Número de teléfono\n" +
                "- Correo electrónico\n" +
                "- Años de experiencia\n" +
                "- Empresas donde ha trabajado\n" +
                "- Tecnologías que domina\n" +
                "- Sistemas Operativos\n" +
                "- Redes\n" +
                "- Cloud\n" +
                "- Virtualización\n" +
                "- Bases de datos\n" +
                "- Ciberseguridad\n" +
                "- Certificaciones\n\n" +

                "Cuando tengas toda la información NO sigas preguntando.\n\n" +

                "Debes responder EXACTAMENTE con este formato:\n\n" +

                "FINALIZADO\n\n" +

                "Nombre:\n" +
                "Telefono:\n" +
                "Email:\n" +
                "Rol:\n" +
                "Nivel:\n" +
                "Skills:\n" +
                "Resumen:\n\n" +

                "El Rol únicamente puede ser:\n" +
                "- Junior\n" +
                "- Semi Senior\n" +
                "- Senior\n" +
                "- Especialista\n\n" +

                "El Nivel únicamente puede ser:\n" +
                "- L1\n" +
                "- L2\n" +
                "- L3",
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
      result: "Error entrevistando al trabajador",
    });
  }
}