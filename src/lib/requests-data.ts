export interface Request {
  id: string;
  client: string;
  service: string;
  status: string;
  date: string;
  desc: string;
  location: string;
  budget: string;
  source?: string;
  resp?: string;
  notes?: string[];
}

export const INITIAL_REQUESTS: Request[] = [
  { id: "REQ-102", client: "Hôtel Royal Atlas", service: "Climatisation VRV/DRV", source: "B2B", status: "Nouveau", resp: "Non assigné", date: "12 Juin 2026", desc: "Étude pour l'installation d'un système VRV complet dans l'aile Nord de l'hôtel. 45 chambres concernées. Urgence moyenne.", location: "Marrakech, Hivernage", budget: "180 000 DH" },
  { id: "REQ-101", client: "Supermarché Marjane", service: "Froid Commercial", source: "B2B", status: "Analyse", resp: "Youssef", date: "11 Juin 2026", desc: "Rénovation de la centrale de traitement d'air et du rayon surgelés. Diagnostic d'efficacité énergétique requis.", location: "Marrakech, Route de Casablanca", budget: "320 000 DH" },
  { id: "REQ-099", client: "Clinique Al Kaoutar", service: "Ventilation Médicale", source: "B2B", status: "Clos", resp: "Sara", date: "05 Juin 2026", desc: "Remplacement des filtres absolus HEPA dans les 3 blocs opératoires et mise en conformité réglementaire.", location: "Marrakech, Guéliz", budget: "64 000 DH" },
  { id: "REQ-105", client: "Karim Bennani (Particulier)", service: "Climatisation Split", source: "B2C", status: "Nouveau", resp: "Non assigné", date: "15 Juin 2026", desc: "Installation de 3 climatiseurs split réversibles pour un appartement de 120m² au Guéliz.", location: "Marrakech, Guéliz", budget: "28 000 DH" },
  { id: "REQ-104", client: "Sophie Martin (Particulier)", service: "Chauffe-eau Solaire", source: "B2C", status: "Nouveau", resp: "Non assigné", date: "14 Juin 2026", desc: "Achat et installation d'un chauffe-eau solaire de 200L pour une villa individuelle.", location: "Marrakech, Palmeraie", budget: "18 000 DH" },
  { id: "REQ-100", client: "Amine Tazi (Particulier)", service: "Plancher Chauffant", source: "B2C", status: "Analyse", resp: "Youssef", date: "10 Juin 2026", desc: "Étude pour un plancher chauffant hydraulique basse température couplé à une pompe à chaleur.", location: "Marrakech, Route de l'Ourika", budget: "95 000 DH" },
  { id: "REQ-098", client: "Riad Dar Anika", service: "Chauffe-eau Solaire", source: "B2B", status: "Nouveau", resp: "Non assigné", date: "04 Juin 2026", desc: "Installation de 4 panneaux solaires thermiques avec ballons d'eau chaude intégrés pour un riad de 8 chambres.", location: "Marrakech, Médina", budget: "45 000 DH" }
];

export const INITIAL_MY_REQUESTS: Request[] = [
  { id: "REQ-101", client: "Supermarché Marjane", service: "Froid Commercial", status: "Analyse", date: "11 Juin 2026", desc: "Rénovation de la centrale de traitement d'air et du rayon surgelés. Diagnostic d'efficacité énergétique requis.", location: "Marrakech, Route de Casablanca", budget: "320 000 DH", notes: ["Appelé le responsable technique le 12/06. Visite prévue sur site demain."] },
  { id: "REQ-102", client: "Hôtel Royal Atlas", service: "Climatisation VRV/DRV", status: "Nouveau", date: "12 Juin 2026", desc: "Étude pour l'installation d'un système VRV complet dans l'aile Nord de l'hôtel. 45 chambres concernées. Urgence moyenne.", location: "Marrakech, Hivernage", budget: "180 000 DH", notes: [] },
  { id: "REQ-095", client: "Café de la Poste", service: "Extraction Ventilation", status: "Devis Envoyé", date: "28 Mai 2026", desc: "Installation d'un système d'extraction d'air de cuisine professionnelle de 4000 m3/h.", location: "Marrakech, Guéliz", budget: "38 000 DH", notes: ["Devis envoyé par email le 02/06. Attente retour client."] }
];

export function findRequestById(id: string): Request | undefined {
  const all = [...INITIAL_REQUESTS, ...INITIAL_MY_REQUESTS];
  return all.find((r) => r.id === id);
}
