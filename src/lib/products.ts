export interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Climatiseur Split Inverter 12000 BTU",
    category: "Systèmes de climatisation",
    description: "Ultra-silencieux, faible consommation énergétique.",
    longDescription: "Ce climatiseur Split Inverter de 12000 BTU est idéal pour refroidir ou chauffer des pièces moyennes. Grâce à sa technologie Inverter, il ajuste en continu la vitesse du compresseur pour maintenir la température souhaitée, réduisant ainsi la consommation d'énergie jusqu'à 30%.",
    price: "4 200",
    image: "/images/products/clim-split-12000.jpg",
    badge: "Nouveau"
  },
  {
    id: 2,
    title: "Climatiseur Console 18000 BTU",
    category: "Systèmes de climatisation",
    description: "Design compact, installation au sol ou mural.",
    longDescription: "Idéal pour les espaces avec des plafonds bas ou où l'installation murale n'est pas possible. Ce modèle console offre une distribution de l'air homogène et une installation flexible au sol ou en bas de mur.",
    price: "6 200",
    image: "/images/products/clim-console-18000.jpg"
  },
  {
    id: 3,
    title: "VMC Double Flux Haut Rendement",
    category: "Équipements de ventilation",
    description: "Récupération de chaleur jusqu'à 95%.",
    longDescription: "Assurez un renouvellement d'air constant dans votre habitation tout en minimisant les pertes thermiques. Cette VMC double flux récupère jusqu'à 95% de la chaleur de l'air extrait pour préchauffer l'air entrant.",
    price: "18 900",
    oldPrice: "21 500",
    image: "/images/products/vmc-double-flux.jpg",
    badge: "Promo"
  },
  {
    id: 4,
    title: "Chauffe-Eau Solaire 300L",
    category: "Produits solaires",
    description: "Ballon d'eau sub-combiné avec capteurs solaires.",
    longDescription: "Réduisez votre facture énergétique avec ce chauffe-eau solaire. Il comprend un ballon de 300L hautement isolé et des capteurs solaires thermiques à haut rendement pour vous fournir de l'eau chaude gratuitement toute l'année.",
    price: "12 500",
    image: "/images/products/chauffe-eau-solaire-300l.jpg"
  },
  {
    id: 5,
    title: "Panneau Photovoltaïque 550W",
    category: "Produits solaires",
    description: "Haut rendement, garantie 25 ans.",
    longDescription: "Ces panneaux photovoltaïques de dernière génération offrent une puissance exceptionnelle de 550W. Avec une tolérance positive et une excellente performance même en faible ensoleillement.",
    price: "2 850",
    image: "/images/products/panneau-pv-550w.jpg"
  },
  {
    id: 6,
    title: "Hotte Professionnelle avec Filtration",
    category: "Équipements cuisine",
    description: "Extracteur puissant, filtres à charbon actif.",
    longDescription: "Conçue pour les cuisines exigeantes, cette hotte dispose d'un système de filtration multicouche (graisse et odeur) et d'un extracteur à haut débit pour maintenir un environnement sain.",
    price: "15 800",
    image: "/images/products/hotte-pro-filtration.jpg"
  },
  {
    id: 7,
    title: "Filtre HEPA H14 (lot de 2)",
    category: "Filtres & accessoires",
    description: "Filtration à 99.995%, compatible VMC.",
    longDescription: "Filtres HEPA H14 de rechange pour assurer la meilleure qualité d'air intérieur, capturant 99.995% des particules fines, des bactéries et des virus.",
    price: "450",
    image: "/images/products/filtre-hepa-h14.jpg"
  },
  {
    id: 8,
    title: "Thermostat Intelligent WiFi",
    category: "Filtres & accessoires",
    description: "Contrôle à distance, programmation horaire.",
    longDescription: "Contrôlez la température de votre maison depuis votre smartphone. Ce thermostat intelligent apprend de vos habitudes pour optimiser votre confort tout en réalisant des économies d'énergie.",
    price: "1 800",
    image: "/images/products/thermostat-wifi.jpg",
    badge: "Nouveau"
  },
  {
    id: 9,
    title: "Extracteur d'Air 150mm",
    category: "Équipements de ventilation",
    description: "Débit 350 m³/h, ultra-silencieux.",
    longDescription: "Extracteur d'air tubulaire puissant et silencieux, idéal pour la ventilation des pièces humides ou comme renfort sur un réseau existant.",
    price: "1 200",
    image: "/images/products/extracteur-axe-150.jpg"
  }
];
