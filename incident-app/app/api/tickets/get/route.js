const loadTicket = async () => {
  console.log("ID recibido en la página:", id);

  const res = await fetch("/api/tickets/get/" + id);

  console.log("URL:", "/api/tickets/get/" + id);

  if (!res.ok) {
    console.error("No se encontró la incidencia");
    return;
  }

  const data = await res.json();

  console.log("Incidencia:", data);

  setTicket(data);
};