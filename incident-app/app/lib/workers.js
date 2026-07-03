import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "workers.json");

// Obtener trabajadores
export function getWorkers() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

// Guardar trabajador
export function saveWorker(worker) {
  const workers = getWorkers();

  workers.push(worker);

  fs.writeFileSync(
    filePath,
    JSON.stringify(workers, null, 2)
  );

  return workers;
}

// Eliminar trabajador
export function deleteWorker(id) {
  const workers = getWorkers().filter(
    (w) => w.id !== id
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(workers, null, 2)
  );

  return workers;
}

// Buscar trabajador por ID
export function getWorkerById(id) {
  const workers = getWorkers();

  return workers.find(
    (w) => w.id === id
  );
}