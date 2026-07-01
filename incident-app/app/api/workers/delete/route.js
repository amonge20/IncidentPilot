import { deleteWorker } from "../../../lib/workers";

export async function DELETE(req) {

  const { id } = await req.json();

  deleteWorker(id);

  return Response.json({
    success: true,
  });

}