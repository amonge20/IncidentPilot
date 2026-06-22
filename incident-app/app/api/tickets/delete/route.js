import { deleteTicket } from "../../../lib/tickets";

export async function DELETE(req) {
  const { id } = await req.json();

  deleteTicket(id);

  return Response.json({
    success: true,
  });
}