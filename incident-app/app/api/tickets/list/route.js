import { getTickets } from "../../../lib/tickets";

export async function GET() {
  try {
    const tickets = getTickets();

    return Response.json(tickets);
  } catch (error) {
    return Response.json([], { status: 500 });
  }
}