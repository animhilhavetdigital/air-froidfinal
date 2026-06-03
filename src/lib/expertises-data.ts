import {
  Home, Building2, Settings,
  ChefHat, Wind, Sliders,
  Sun, Wrench, Lightbulb,
  FileText, Headset, AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export interface SubService {
  name: string;
  icon: LucideIcon;
  desc: string;
}

export interface ServiceData {
  id: string;
  number: string;
  title: string;
  desc: string;
  image: string;
  color: string;
  subServices: SubService[];
}

export const SERVICES: ServiceData[] = [
  {
    id: "climatisation",
    number: "01",
    title: "Climatisation",
    desc: "Systèmes de refroidissement de pointe assurant un confort thermique optimal, conçus pour s'intégrer parfaitement à tous types d'espaces avec une efficacité énergétique maximale.",
    image: "/images/assets/expertises-climatisation.jpg",
    color: "#10748E",
    subServices: [
      { name: "Climatisation résidentielle", icon: Home, desc: "Splits, multi-splits et gainables pour villas et appartements" },
      { name: "Climatisation professionnelle", icon: Building2, desc: "VRV/DRV et groupes d'eau glacée pour bureaux et industries" },
      { name: "Maintenance climatisation", icon: Settings, desc: "Entretien préventif et curatif pour pérenniser vos installations" },
    ],
  },
  {
    id: "ventilation",
    number: "02",
    title: "Ventilation",
    desc: "Extraction et traitement de l'air pour garantir un environnement sain, sans odeurs ni polluants, dans les espaces clos et professionnels.",
    image: "/images/assets/expertises-ventilation.jpg",
    color: "#32A5DE",
    subServices: [
      { name: "VMC Services Associés professionnelle", icon: ChefHat, desc: "Hottes et extraction sur-mesure pour la restauration" },
      { name: "Ventilation générale", icon: Wind, desc: "VMC Double flux et centrales de traitement d'air (CTA)" },
      { name: "Solutions spécialisées", icon: Sliders, desc: "Filtration absolue et désenfumage" },
    ],
  },
  {
    id: "solaire",
    number: "03",
    title: "Solaire",
    desc: "Solutions d'énergie renouvelable pour réduire votre empreinte carbone et vos factures énergétiques avec des installations photovoltaïques fiables et durables.",
    image: "/images/assets/expertises-solaire.jpg",
    color: "#00883C",
    subServices: [
      { name: "Installation solaire", icon: Sun, desc: "Dimensionnement et pose de panneaux photovoltaïques" },
      { name: "Maintenance solaire", icon: Wrench, desc: "Nettoyage et contrôle des équipements et onduleurs" },
      { name: "Consulting solaire", icon: Lightbulb, desc: "Audits énergétiques et études de faisabilité" },
    ],
  },
  {
    id: "services-associes",
    number: "04",
    title: "Services Associés",
    desc: "Un accompagnement sur le long terme avec des contrats de suivi et un support technique réactif pour garantir la performance continue de vos équipements.",
    image: "/images/assets/expertises-services.jpg",
    color: "#AF1818",
    subServices: [
      { name: "Contrats de maintenance", icon: FileText, desc: "Programmes d'entretien personnalisés et réguliers" },
      { name: "Support technique", icon: Headset, desc: "Assistance experte par téléphone ou sur site" },
      { name: "Interventions d'urgence", icon: AlertTriangle, desc: "Dépannage rapide 7j/7 pour vos systèmes critiques" },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES.find((s) => s.id === slug);
}
