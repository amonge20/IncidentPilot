import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const ticketsPath = path.join(process.cwd(), "tickets.json");

export async function POST(req) {
  try {
    const { ticketId } = await req.json();

    const tickets = JSON.parse(fs.readFileSync(ticketsPath, "utf8"));

    const ticket = tickets.find((t) => t.id === ticketId);

    if (!ticket) {
      return Response.json({
        success: false,
        message: "Incidencia no encontrada",
      });
    }

    const reportsFolder = path.join(process.cwd(), "public", "reports");

    if (!fs.existsSync(reportsFolder)) {
      fs.mkdirSync(reportsFolder, {
        recursive: true,
      });
    }

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595, 842]); // A4

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 800;

    function title(text) {
      page.drawRectangle({
        x: 40,
        y: y - 5,
        width: 515,
        height: 22,
        color: rgb(0.93, 0.95, 0.98),
      });

      page.drawText(text, {
        x: 50,
        y,
        size: 13,
        font: bold,
        color: rgb(0.1, 0.3, 0.6),
      });

      y -= 32;
    }

    function line(text) {
      const value = String(text ?? "");

      page.drawText(value, {
        x: 50,
        y,
        size: 11,
        font,
        color: rgb(0, 0, 0),

        maxWidth: 490,
        lineHeight: 15,
      });

      const lines = Math.ceil(font.widthOfTextAtSize(value, 11) / 490) || 1;

      y -= lines * 15 + 8;
    }

    // ==========================
    // CABECERA PROFESIONAL
    // ==========================

    // Barra superior
    page.drawRectangle({
      x: 0,
      y: 790,
      width: 595,
      height: 52,
      color: rgb(0.12, 0.32, 0.72),
    });

    page.drawText("SERVICE DESK IA", {
      x: 40,
      y: 810,
      size: 22,
      font: bold,
      color: rgb(1, 1, 1),
    });

    page.drawText("Informe Técnico de Incidencia", {
      x: 40,
      y: 792,
      size: 10,
      font,
      color: rgb(1, 1, 1),
    });

    page.drawText(ticket.id, {
      x: 450,
      y: 806,
      size: 18,
      font: bold,
      color: rgb(1, 1, 1),
    });

    y = 760;

    // ==========================
    // CLIENTE
    // ==========================
    page.drawRectangle({
      x: 35,
      y: y - 5,
      width: 525,
      height: 85,
      borderWidth: 1,
      borderColor: rgb(0.8, 0.8, 0.8),
    });

    title("DATOS DEL CLIENTE");

    line(`Nombre: ${ticket.user}`);

    line(`Empresa: ${ticket.company}`);

    line(`Correo: ${ticket.email}`);

    line(`Teléfono: ${ticket.phone}`);

    line(`Dirección: ${ticket.location}`);

    y -= 20;

    // ==========================
    // IA
    // ==========================

    page.drawRectangle({
      x: 35,
      y: y - 5,
      width: 525,
      height: 70,
      color: rgb(0.97, 0.97, 0.97),
    });

    title("RESUMEN IA");

    line(ticket.summary || "");

    y -= 20;

    // ==========================
    // INFORME TÉCNICO
    // ==========================

    if (ticket.workReport) {
      page.drawRectangle({
        x: 35,
        y: y - 5,
        width: 525,
        height: 220,
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
      });

      title("INFORME DEL TÉCNICO");

      line("Problema:");

      line(ticket.workReport.problem || "");

      y -= 10;

      line("Solución:");

      line(ticket.workReport.solution || "");

      y -= 10;

      line("Componente cambiado:");

      line(ticket.workReport.component || "");

      y -= 10;

      line(`Estado: ${ticket.workReport.resolved ? "Resuelta" : "Pendiente"}`);

      line(`Técnico: ${ticket.workReport.worker}`);

      line(
        `Finalizada: ${new Date(
          ticket.workReport.finishedAt,
        ).toLocaleString()}`,
      );
    }

    // ==========================
    // FIRMAS (texto por ahora)
    // ==========================

    y -= 40;

    title("FIRMAS");

    if (ticket.workReport?.workerSignature) {
      const workerBase64 = ticket.workReport.workerSignature.split(",")[1];

      const workerImage = await pdfDoc.embedPng(
        Buffer.from(workerBase64, "base64"),
      );

      page.drawRectangle({
        x: 40,
        y: y - 75,
        width: 200,
        height: 90,
        borderWidth: 1,
        borderColor: rgb(0.7, 0.7, 0.7),
      });

      page.drawText("Firma del técnico", {
        x: 50,
        y,
        size: 11,
        font: bold,
      });

      y -= 15;

      page.drawImage(workerImage, {
        x: 50,
        y: y - 60,
        width: 180,
        height: 60,
      });
    }

    if (ticket.workReport?.clientSignature) {
      const clientBase64 = ticket.workReport.clientSignature.split(",")[1];

      const clientImage = await pdfDoc.embedPng(
        Buffer.from(clientBase64, "base64"),
      );

      page.drawRectangle({
        x: 310,
        y: y - 75,
        width: 200,
        height: 90,
        borderWidth: 1,
        borderColor: rgb(0.7, 0.7, 0.7),
      });

      page.drawText("Firma del cliente", {
        x: 320,
        y: y + 45,
        size: 11,
        font: bold,
      });

      page.drawImage(clientImage, {
        x: 320,
        y: y - 60,
        width: 180,
        height: 60,
      });
    }

    y -= 100;
    // ==========================
    // GUARDAR PDF
    // ==========================

    page.drawLine({
      start: { x: 40, y: 40 },
      end: { x: 555, y: 40 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText("Documento generado automáticamente por Service Desk IA", {
      x: 40,
      y: 22,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(new Date().toLocaleString(), {
      x: 420,
      y: 22,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    const pdfBytes = await pdfDoc.save();

    const pdfPath = path.join(reportsFolder, `${ticket.id}.pdf`);

    fs.writeFileSync(pdfPath, pdfBytes);

    return Response.json({
      success: true,
      file: `/reports/${ticket.id}.pdf`,
    });
  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      message: err.message,
    });
  }
}
