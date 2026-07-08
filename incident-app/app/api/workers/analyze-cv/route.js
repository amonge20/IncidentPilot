import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("cv");

    if (!file) {
      return NextResponse.json(
        {
          valid: false,
          error: "No se ha recibido ningún archivo.",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          valid: false,
          error: "Solo se permiten archivos PDF.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ===========================
    // EXTRAER TEXTO DEL PDF
    // ===========================

    const text = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (err) => {
        reject(err);
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        let result = "";

        pdfData.Pages.forEach((page) => {
          page.Texts.forEach((text) => {
            text.R.forEach((r) => {
              try {
                result += decodeURIComponent(r.T) + " ";
              } catch {
                result += r.T + " ";
              }
            });
          });

          result += "\n";
        });

        resolve(result);
      });

      pdfParser.parseBuffer(buffer);
    });

    // ===========================
    // IA
    // ===========================

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
Eres un experto en Recursos Humanos especializado en informática.

Analiza el CV y devuelve únicamente JSON válido.

{
  "name":"",
  "email":"",
  "phone":"",
  "dni":"",
  "experience":0,
  "role":"",
  "level":"",
  "skills":[]
}

Los roles permitidos son:

- HelpDesk
- Técnico de Campo
- Técnico de Sistemas
- Administrador de Sistemas
- DevOps
- Programador
- Ciberseguridad
- Cloud Engineer

Los niveles permitidos:

- Junior
- Semi Senior
- Senior

No escribas absolutamente nada fuera del JSON.
`,
            },
            {
              role: "user",
              content: text,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let content = data.choices?.[0]?.message?.content || "";

    // Elimina ```json ... ```
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(content);
    } catch (err) {
      console.error("Respuesta IA:", content);

      return NextResponse.json(
        {
          valid: false,
          error: "La IA devolvió un JSON inválido.",
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
        error: "No se pudo analizar el CV.",
      },
      {
        status: 500,
      }
    );
  }
}