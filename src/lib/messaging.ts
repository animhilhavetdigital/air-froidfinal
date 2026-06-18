export interface ThreadMessage {
  id: string;
  text: string;
  time: string;
  realSender: "client" | "commercial" | "super_admin";
  displayAs: "client" | "commercial";
  senderName: string;
}

export interface Thread {
  id: number;
  clientId: string;
  clientName: string;
  clientCompany?: string;
  commercialId: string;
  commercialName: string;
  messages: ThreadMessage[];
  unread: number;
}

const THREADS_STORAGE_KEY = "afe_threads";

export function getThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(THREADS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : getInitialThreads();
  } catch {
    return getInitialThreads();
  }
}

export function saveThreads(threads: Thread[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
}

export function getInitialThreads(): Thread[] {
  return [
    {
      id: 1,
      clientId: "CLI-390",
      clientName: "Yassine Boustane",
      clientCompany: "Société Al Boustane",
      commercialId: "commercial-sara",
      commercialName: "Sara",
      unread: 2,
      messages: [
        {
          id: "m1",
          text: "Bonjour, j'ai soumis nos documents pour la validation de notre compte B2B.",
          time: "10:30",
          realSender: "client",
          displayAs: "client",
          senderName: "Yassine Boustane",
        },
        {
          id: "m2",
          text: "Est-ce qu'il vous manque des pièces comme la patente ou le RC ?",
          time: "10:32",
          realSender: "client",
          displayAs: "client",
          senderName: "Yassine Boustane",
        },
      ],
    },
    {
      id: 2,
      clientId: "CLI-402",
      clientName: "Mohamed Alami",
      clientCompany: "Hôtel Royal Atlas",
      commercialId: "commercial-youssef",
      commercialName: "Youssef",
      unread: 0,
      messages: [
        {
          id: "m3",
          text: "Bonjour Youssef, avez-vous pu finaliser l'étude thermique de l'aile Nord ?",
          time: "Hier, 14:15",
          realSender: "client",
          displayAs: "client",
          senderName: "Mohamed Alami",
        },
        {
          id: "m4",
          text: "Bonjour Mohamed, oui notre bureau d'études y travaille. Je vous envoie le devis demain matin sans faute.",
          time: "Hier, 15:30",
          realSender: "commercial",
          displayAs: "commercial",
          senderName: "Youssef",
        },
        {
          id: "m5",
          text: "Parfait, merci pour votre réactivité.",
          time: "Hier, 15:45",
          realSender: "client",
          displayAs: "client",
          senderName: "Mohamed Alami",
        },
      ],
    },
    {
      id: 3,
      clientId: "CLI-399",
      clientName: "Jean Dupont",
      clientCompany: "Villa Palmeraie",
      commercialId: "commercial-youssef",
      commercialName: "Youssef",
      unread: 0,
      messages: [
        {
          id: "m6",
          text: "Sara, peux-tu valider le dimensionnement de la PAC pour le projet Villa Palmeraie ?",
          time: "12 Juin, 11:20",
          realSender: "commercial",
          displayAs: "commercial",
          senderName: "Sara",
        },
        {
          id: "m7",
          text: "Oui c'est tout bon. Puissance de 16kW recommandée. J'ai déposé la fiche dans le dossier.",
          time: "12 Juin, 11:45",
          realSender: "client",
          displayAs: "client",
          senderName: "Jean Dupont",
        },
      ],
    },
  ];
}

export function createThread(
  clientId: string,
  clientName: string,
  clientCompany: string,
  commercialId: string,
  commercialName: string
): Thread {
  return {
    id: Date.now(),
    clientId,
    clientName,
    clientCompany,
    commercialId,
    commercialName,
    messages: [],
    unread: 0,
  };
}

export function addMessage(
  threads: Thread[],
  threadId: number,
  message: ThreadMessage
): Thread[] {
  return threads.map((t) => {
    if (t.id !== threadId) return t;
    return { ...t, messages: [...t.messages, message] };
  });
}

export function createNotification(
  title: string,
  desc: string,
  role: string,
  category: string,
  href?: string
): void {
  if (typeof window === "undefined") return;
  const savedNotifs = localStorage.getItem("afe_notifications");
  const allNotifs: any[] = savedNotifs ? JSON.parse(savedNotifs) : [];
  allNotifs.unshift({
    id: Date.now() + Math.random(),
    type: "Message",
    title,
    desc,
    time: "À l'instant",
    read: false,
    category,
    href,
    role,
  });
  localStorage.setItem("afe_notifications", JSON.stringify(allNotifs));
}

export const COMMERCIALS = [
  { id: "commercial-youssef", name: "Youssef" },
  { id: "commercial-sara", name: "Sara" },
];

export function getCurrentUserInfo(): { role: string; name: string; id: string; company?: string } {
  if (typeof window === "undefined") return { role: "client_b2b", name: "Client", id: "" };
  const role = localStorage.getItem("afe_mock_role") || "client_b2b";
  if (role === "super_admin") return { role, name: "Mada Admin", id: "super-admin" };
  if (role === "commercial") return { role, name: "Youssef", id: "commercial-youssef" };
  // Client B2B — try to find current client
  const currentClientId = localStorage.getItem("afe_current_client_id");
  const savedClients = localStorage.getItem("afe_clients");
  if (savedClients) {
    try {
      const clients = JSON.parse(savedClients);
      const client = currentClientId
        ? clients.find((c: any) => c.id === currentClientId)
        : clients[0];
      if (client) {
        return { role, name: client.contact, id: client.id, company: client.company };
      }
    } catch {
      // ignore
    }
  }
  return { role, name: "Client", id: "" };
}
