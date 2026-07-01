import { getWorkers } from "../../../lib/workers";

export async function GET() {
  return Response.json(getWorkers());
}