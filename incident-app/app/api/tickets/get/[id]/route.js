import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "tickets.json");

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!fs.existsSync(filePath)) {
      return Response.json(
        { error: "No existe tickets.json" },
        { status: 500 }
      );
    }

    const tickets = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    // Buscar ignorando espacios y mayúsculas
    const ticket = tickets.find((t) => {
      return (
        String(t.id).trim().toLowerCase() ===
        String(id).trim().toLowerCase()
      );
    });

    if (!ticket) {
      return Response.json(
        {
          error: "Incidencia no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(ticket);
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}