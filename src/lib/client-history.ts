export function addClientHistoryEvent(clientName: string, event: string): void {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("afe_clients");
  if (!saved) return;
  try {
    const clients = JSON.parse(saved);
    const idx = clients.findIndex((c: any) => c.company === clientName);
    if (idx >= 0) {
      const history = clients[idx].history || [];
      const timestamp = new Date().toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      clients[idx].history = [`[${timestamp}] ${event}`, ...history];
      localStorage.setItem("afe_clients", JSON.stringify(clients));
    }
  } catch {
    // ignore
  }
}

export function findClientEmail(clientName: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const saved = localStorage.getItem("afe_clients");
  if (!saved) return undefined;
  try {
    const clients = JSON.parse(saved);
    const client = clients.find((c: any) => c.company === clientName);
    return client?.email;
  } catch {
    return undefined;
  }
}
