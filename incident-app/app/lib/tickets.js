import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "tickets.json");

// Leer tickets
export function getTickets() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

// Guardar ticket
export function saveTicket(ticket) {
  const tickets = getTickets();

  tickets.push(ticket);

  fs.writeFileSync(
    filePath,
    JSON.stringify(tickets, null, 2)
  );

  return tickets;
}

// Eliminar ticket
export function deleteTicket(id) {
  const tickets = getTickets();

  const filteredTickets = tickets.filter(
    (t) => t.id !== id
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(filteredTickets, null, 2)
  );

  return filteredTickets;
}

// Assignar trabajadores
export function assignWorker(ticketId, worker) {

  const tickets = getTickets();

  const index = tickets.findIndex(
    (t) => t.id === ticketId
  );

  if (index === -1) return false;

  tickets[index].assignedWorker = worker;

  fs.writeFileSync(
    filePath,
    JSON.stringify(tickets, null, 2)
  );

  return true;
}