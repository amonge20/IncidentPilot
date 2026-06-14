import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "tickets.json");

// leer tickets
export function getTickets() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

// guardar tickets
export function saveTicket(ticket) {
  const tickets = getTickets();
  tickets.push(ticket);
  fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2));
  return tickets;
}