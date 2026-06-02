export interface ServiceFeature {
  title: string;
  description: string;
}

export interface SubService {
  title: string;
  description: string;
  features: ServiceFeature[];
}

export interface ServiceDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string; // We'll use this to determine which icon to render
  image: string;
  subServices: SubService[];
}

export const SERVICES: ServiceDefinition[] = [
  {
    slug: "solaire",
    title: "Solaire",
    shortDescription: "Solutions d'énergie solaire photovoltaïque.",
    description:
      "Transitionnez vers une énergie propre et inépuisable avec nos solutions solaires de pointe. Nous concevons, installons et entretenons des systèmes photovoltaïques performants pour répondre à vos besoins énergétiques.",
    icon: "sun",
    image: "/images/services/solaire-bg.jpg",
    subServices: [
      {
        title: "Installation solaire",
        description: "Mise en place de panneaux solaires pour particuliers et professionnels.",
        features: [
          { title: "Étude personnalisée", description: "Analyse de votre consommation et de votre potentiel solaire." },
          { title: "Installation clé en main", description: "Pose des panneaux et raccordement au réseau." },
        ],
      },
      {
        title: "Maintenance solaire",
        description: "Entretien préventif et curatif de vos installations photovoltaïques.",
        features: [
          { title: "Nettoyage des panneaux", description: "Optimisation du rendement par un nettoyage régulier." },
          { title: "Contrôle des onduleurs", description: "Vérification des équipements électriques." },
        ],
      },
      {
        title: "Consulting solaire",
        description: "Accompagnement et conseil pour vos projets d'efficacité énergétique.",
        features: [
          { title: "Audits énergétiques", description: "Évaluation complète de vos besoins et potentiels." },
          { title: "Études de faisabilité", description: "Analyse technico-économique de vos projets." },
        ],
      },
    ],
  },
  {
    slug: "climatisation",
    title: "Climatisation",
    shortDescription: "Systèmes de climatisation performants.",
    description:
      "Maîtrisez la température de vos espaces avec nos solutions de climatisation innovantes et écoénergétiques. De l'installation à la maintenance, nous assurons votre confort thermique tout au long de l'année.",
    icon: "snowflake",
    image: "/images/services/climatisation-bg.jpg",
    subServices: [
      {
        title: "Climatisation résidentielle",
        description: "Solutions de confort thermique pour votre habitat.",
        features: [
          { title: "Splits et Multi-splits", description: "Installation d'unités murales silencieuses." },
          { title: "Gainables", description: "Climatisation invisible et homogène." },
        ],
      },
      {
        title: "Climatisation professionnelle",
        description: "Systèmes HVAC pour bureaux, commerces et industries.",
        features: [
          { title: "VRV / DRV", description: "Solutions à débit de réfrigérant variable pour grands espaces." },
          { title: "Groupes d'eau glacée", description: "Refroidissement pour applications industrielles." },
        ],
      },
      {
        title: "Maintenance climatisation",
        description: "Contrats d'entretien pour pérenniser vos installations.",
        features: [
          { title: "Entretien régulier", description: "Nettoyage des filtres et contrôle des gaz." },
          { title: "Dépannage rapide", description: "Intervention en cas de panne." },
        ],
      },
    ],
  },
  {
    slug: "ventilation",
    title: "Ventilation",
    shortDescription: "Solutions de traitement de l'air.",
    description:
      "Assurez une qualité d'air optimale avec nos systèmes de ventilation. Nous proposons des solutions adaptées aux exigences sanitaires et industrielles les plus strictes pour garantir un environnement sain.",
    icon: "wind",
    image: "/images/services/ventilation-bg.jpg",
    subServices: [
      {
        title: "VMC Services Associés professionnelle",
        description: "Extraction et traitement de l'air pour la restauration.",
        features: [
          { title: "Hottes professionnelles", description: "Installation de systèmes d'extraction sur mesure." },
          { title: "Filtration des graisses", description: "Solutions pour limiter les nuisances olfactives." },
        ],
      },
      {
        title: "Ventilation générale",
        description: "Renouvellement de l'air pour locaux tertiaires et industriels.",
        features: [
          { title: "VMC Double flux", description: "Récupération d'énergie et purification de l'air." },
          { title: "Centrales de traitement d'air", description: "Contrôle précis de la température et de l'humidité." },
        ],
      },
      {
        title: "Solutions spécialisées",
        description: "Ventilation pour salles blanches et milieux spécifiques.",
        features: [
          { title: "Filtration absolue", description: "Systèmes HEPA pour environnements contrôlés." },
          { title: "Désenfumage", description: "Installation de systèmes de sécurité incendie." },
        ],
      },
    ],
  },
  {
    slug: "Services Associés-professionnelles",
    title: "Services Associés Pro",
    shortDescription: "Équipements et aménagement de Services Associés.",
    description:
      "Conception et équipement complet de Services Associés professionnelles. Nous accompagnons les professionnels de la restauration dans l'aménagement d'espaces fonctionnels, ergonomiques et conformes aux normes d'hygiène.",
    icon: "utensils",
    image: "/images/services/Services Associés-bg.jpg",
    subServices: [
      {
        title: "Équipements Services Associés",
        description: "Fourniture de matériel de cuisson, préparation et laverie.",
        features: [
          { title: "Matériel de cuisson", description: "Fours, fourneaux, friteuses de qualité professionnelle." },
          { title: "Froid commercial", description: "Armoires réfrigérées, chambres froides, vitrines." },
        ],
      },
      {
        title: "Installation",
        description: "Mise en place et raccordement de vos équipements.",
        features: [
          { title: "Aménagement sur mesure", description: "Inox sur mesure et agencement ergonomique." },
          { title: "Raccordements", description: "Plomberie, électricité et gaz spécifiques." },
        ],
      },
      {
        title: "Maintenance",
        description: "SAV et entretien de votre matériel de Services Associés.",
        features: [
          { title: "Contrats SAV", description: "Interventions préventives et réactives." },
          { title: "Pièces détachées", description: "Fourniture rapide de pièces de rechange." },
        ],
      },
    ],
  },
  {
    slug: "services-associes",
    title: "Services Associés",
    shortDescription: "Maintenance, support et dépannage.",
    description:
      "Un accompagnement continu pour garantir la pérennité et la performance de vos installations. Nos équipes techniques sont à votre disposition pour assurer l'entretien, le dépannage et l'optimisation de vos équipements.",
    icon: "tool",
    image: "/images/services/maintenance-bg.jpg",
    subServices: [
      {
        title: "Contrats de maintenance",
        description: "Programmes d'entretien personnalisés.",
        features: [
          { title: "Visites préventives", description: "Planification des interventions régulières." },
          { title: "Rapports d'intervention", description: "Suivi détaillé de l'état de vos équipements." },
        ],
      },
      {
        title: "Support technique",
        description: "Assistance téléphonique et conseils d'experts.",
        features: [
          { title: "Hotline dédiée", description: "Assistance rapide par nos techniciens." },
          { title: "Télémaintenance", description: "Diagnostic à distance pour les systèmes connectés." },
        ],
      },
      {
        title: "Interventions d'urgence",
        description: "Dépannage rapide 7j/7 et 24h/24.",
        features: [
          { title: "Astreinte technique", description: "Équipes mobilisables en dehors des heures ouvrées." },
          { title: "Stocks de sécurité", description: "Disponibilité des pièces critiques." },
        ],
      },
    ],
  },
];
