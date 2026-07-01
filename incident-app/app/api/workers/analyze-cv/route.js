import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv");

    if (!file) {
      return NextResponse.json(
        { valid: false, error: "No se ha recibido el CV." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { valid: false, error: "Solo se permiten PDFs." },
        { status: 400 }
      );
    }

    // 📄 PDF -> texto (IMPORT CORRECTO PARA TURBOPACK)
    const buffer = Buffer.from(await file.arrayBuffer());

    const pdfModule = await import("pdf-parse/lib/pdf-parse.js");
    const pdfParse = pdfModule.default;

    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (!text || text.length < 50) {
      return NextResponse.json(
        { valid: false, error: "No se pudo extraer texto del CV." },
        { status: 400 }
      );
    }

    // 🤖 GROQ
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
              content: `
Eres un experto en RRHH IT.

Devuelve SOLO JSON válido con:

- name
- email
- phone
- dni (o null)
- experience (años)
- role (Técnico de Campo, Técnico de Sistemas, HelpDesk, DevOps, Ciberseguridad, Programador, Administrador de Sistemas)
- level (Junior, Semi Senior, Senior)
- skills (array)

NO expliques nada.
NO texto fuera del JSON.
              `,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { valid: false, error: "La IA no devolvió respuesta." },
        { status: 500 }
      );
    }

    let result;

    try {
      result = JSON.parse(content);
    } catch (e) {
      return NextResponse.json(
        {
          valid: false,
          error: "JSON inválido de la IA",
          raw: content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      valid: true,
      ...result,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        valid: false,
        error: "Error interno analizando el CV.",
      },
      { status: 500 }
    );
  }
}