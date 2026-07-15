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
Eres un especialista en Recursos Humanos para una empresa de soporte informático.

Analiza el CV y devuelve EXCLUSIVAMENTE un JSON válido.

Normas IMPORTANTES:

1. El nombre debe ser únicamente el nombre completo del candidato.
   - Nunca devuelvas nombres de empresas.
   - Nunca devuelvas nombres de institutos.
   - Nunca devuelvas direcciones.
   - Nunca devuelvas ciudades.

2. El email debe ser únicamente el del candidato.

3. El teléfono debe ser únicamente el del candidato.

4. No devuelvas DNI.
   Si no existe, simplemente omite ese campo.

5. experience debe ser los años reales de experiencia profesional aproximados.
   No sumes estudios.
   No inventes años.

6. role debe ser UNO de estos:

- Help Desk
- Técnico de Campo
- Técnico de Sistemas
- Administrador de Sistemas
- DevOps
- Programador
- Cloud Engineer
- Ciberseguridad

Escoge únicamente el rol predominante.

7. level debe ser:

- Junior
- Semi Senior
- Senior

8. skills debe ser un ARRAY de tecnologías.

Ejemplo:

[
"Windows",
"Linux",
"Cisco",
"Active Directory",
"Office 365",
"PHP",
"MySQL"
]

Nunca añadas:

- empresas
- ciudades
- institutos
- personas

9. Genera una contraseña temporal segura.

Debe contener:

- mayúsculas
- minúsculas
- números
- un símbolo

Ejemplo:

"Aitor#2026"

Devuelve únicamente:

{
  "name":"",
  "email":"",
  "phone":"",
  "experience":0,
  "role":"",
  "level":"",
  "skills":[],
  "password":""
}

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