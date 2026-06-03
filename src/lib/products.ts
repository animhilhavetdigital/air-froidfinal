export interface SpecSection {
  title: string;
  items: Record<string, string>;
}

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
  reference?: string;
  brand?: string;
  warranty?: string;
  features?: string[];
  specSections?: SpecSection[];
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
    badge: "Nouveau",
    reference: "SPL-INV-12K-AFE",
    brand: "Air Froid Expert",
    warranty: "3 ans",
    features: [
      "Technologie Inverter : économies d'énergie jusqu'à 30%",
      "Mode nuit ultra-silencieux",
      "Fonction chauffage et refroidissement",
      "Filtre anti-poussière et anti-allergène",
      "Télécommande LCD avec minuterie",
      "Dégivrage automatique intelligent"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Fréquence": "50 Hz",
          "Marque": "Air Froid Expert",
          "Classe d'efficacité énergétique": "A++/A+",
          "Tension": "220-240 V",
          "Code produit": "SPL-INV-12K-AFE",
          "Zone d'application": "20 – 35 m²",
          "Niveau de pression sonore extérieur": "48 dB(A)",
          "Réfrigérant": "R32",
          "Débit d'air intérieur": "550 m³/h"
        }
      },
      {
        title: "Unité Extérieur",
        items: {
          "Poids de l'unité extérieure": "26 kg",
          "Largeur de l'unité extérieure": "780 mm",
          "Profondeur de l'unité extérieure": "270 mm",
          "Hauteur de l'unité extérieure": "550 mm"
        }
      },
      {
        title: "Unité Intérieur",
        items: {
          "Poids de l'unité intérieure": "8,5 kg",
          "Largeur de l'unité intérieure": "805 mm",
          "Profondeur de l'unité intérieure": "194 mm",
          "Hauteur de l'unité intérieure": "285 mm"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "Split system air conditioner",
          "Technologie de convertisseur": "Technologie DC Inverter",
          "Capacité de refroidissement nominale": "3517 W",
          "Capacité de chauffage nominale": "3760 W",
          "Puissance": "12 000 BTU"
        }
      }
    ]
  },
  {
    id: 2,
    title: "Climatiseur Console 18000 BTU",
    category: "Systèmes de climatisation",
    description: "Design compact, installation au sol ou mural.",
    longDescription: "Idéal pour les espaces avec des plafonds bas ou où l'installation murale n'est pas possible. Ce modèle console offre une distribution de l'air homogène et une installation flexible au sol ou en bas de mur.",
    price: "6 200",
    image: "/images/products/clim-console-18000.jpg",
    reference: "CON-18K-AFE",
    brand: "Air Froid Expert",
    warranty: "3 ans",
    features: [
      "Installation au sol ou en bas de mur",
      "Distribution d'air homogène à 360°",
      "Parfait pour les plafonds bas",
      "Design compact et discret",
      "Fonction déshumidification",
      "Réservoir de condensation intégré avec pompe"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Fréquence": "50 Hz",
          "Marque": "Air Froid Expert",
          "Classe d'efficacité énergétique": "A+/A+",
          "Tension": "220-240 V",
          "Code produit": "CON-18K-AFE",
          "Zone d'application": "35 – 55 m²",
          "Niveau de pression sonore extérieur": "52 dB(A)",
          "Réfrigérant": "R32",
          "Débit d'air intérieur": "850 m³/h"
        }
      },
      {
        title: "Unité Extérieur",
        items: {
          "Poids de l'unité extérieure": "38 kg",
          "Largeur de l'unité extérieure": "850 mm",
          "Profondeur de l'unité extérieure": "330 mm",
          "Hauteur de l'unité extérieure": "600 mm"
        }
      },
      {
        title: "Unité Intérieur",
        items: {
          "Poids de l'unité intérieure": "32 kg",
          "Largeur de l'unité intérieure": "700 mm",
          "Profondeur de l'unité intérieure": "230 mm",
          "Hauteur de l'unité intérieure": "580 mm"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "Console floor/wall air conditioner",
          "Technologie de convertisseur": "Technologie DC Inverter",
          "Capacité de refroidissement nominale": "5275 W",
          "Capacité de chauffage nominale": "5800 W",
          "Puissance": "18 000 BTU"
        }
      }
    ]
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
    badge: "Promo",
    reference: "VMC-DF-HR-AFE",
    brand: "Air Froid Expert",
    warranty: "5 ans",
    features: [
      "Récupération de chaleur jusqu'à 95%",
      "Filtres lavables et facilement accessibles",
      "Vitesse variable automatique (hygro ou CO2)",
      "Isolation phonique renforcée",
      "Bypass estival gratuit",
      "Compatible avec domotique"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Fréquence": "50 Hz",
          "Marque": "Air Froid Expert",
          "Classe énergétique": "A+",
          "Tension": "220-240 V",
          "Code produit": "VMC-DF-HR-AFE",
          "Zone d'application": "Jusqu'à 250 m²",
          "Niveau sonore": "28 – 45 dB",
          "Filtres": "G4 + F7 (option HEPA)",
          "Poids": "32 kg"
        }
      },
      {
        title: "Dimensions",
        items: {
          "Largeur": "650 mm",
          "Profondeur": "520 mm",
          "Hauteur": "480 mm"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "VMC Double Flux",
          "Débit d'air": "150 – 350 m³/h",
          "Rendement de récupération": "Jusqu'à 95%",
          "Alimentation": "220-240V / 50Hz",
          "Poids": "32 kg"
        }
      }
    ]
  },
  {
    id: 4,
    title: "Chauffe-Eau Solaire 300L",
    category: "Produits solaires",
    description: "Ballon d'eau sub-combiné avec capteurs solaires.",
    longDescription: "Réduisez votre facture énergétique avec ce chauffe-eau solaire. Il comprend un ballon de 300L hautement isolé et des capteurs solaires thermiques à haut rendement pour vous fournir de l'eau chaude gratuitement toute l'année.",
    price: "12 500",
    image: "/images/products/chauffe-eau-solaire-300l.jpg",
    reference: "CES-300L-AFE",
    brand: "Air Froid Expert",
    warranty: "5 ans",
    features: [
      "Jusqu'à 75% d'économies sur l'eau chaude",
      "Ballon inox double enveloppe",
      "Capteurs solaires à haut rendement",
      "Résistance électrique de secours",
      "Anode magnésium anti-corrosion",
      "Installation sur toiture ou terrasse"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Fréquence": "50 Hz",
          "Marque": "Air Froid Expert",
          "Classe énergétique": "A++",
          "Tension": "220-240 V",
          "Code produit": "CES-300L-AFE",
          "Zone d'application": "3 – 5 personnes",
          "Pression max": "6 bar",
          "Isolation": "Polyuréthane haute densité",
          "Surface capteurs": "4 m²"
        }
      },
      {
        title: "Dimensions ballon",
        items: {
          "Diamètre": "580 mm",
          "Hauteur": "1650 mm",
          "Poids à vide": "52 kg"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "Solaire thermique",
          "Capacité": "300 litres",
          "Surface capteurs": "4 m²",
          "Résistance de secours": "2000 W",
          "Pression max": "6 bar",
          "Isolation": "Polyuréthane haute densité"
        }
      }
    ]
  },
  {
    id: 5,
    title: "Panneau Photovoltaïque 550W",
    category: "Produits solaires",
    description: "Haut rendement, garantie 25 ans.",
    longDescription: "Ces panneaux photovoltaïques de dernière génération offrent une puissance exceptionnelle de 550W. Avec une tolérance positive et une excellente performance même en faible ensoleillement.",
    price: "2 850",
    image: "/images/products/panneau-pv-550w.jpg",
    reference: "PV-550W-MONO",
    brand: "SunPower Pro",
    warranty: "25 ans",
    features: [
      "Haute efficacité monocristallin PERC",
      "Performance élevée en faible luminosité",
      "Tolérance positive de puissance",
      "Vitre trempée anti-reflet",
      "Cadre aluminium anodisé",
      "Résistance aux conditions extrêmes"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Marque": "SunPower Pro",
          "Classe énergétique": "A+",
          "Code produit": "PV-550W-MONO",
          "Zone d'application": "Installation solaire",
          "Technologie": "Monocristallin PERC",
          "Tolérance de puissance": "0 / +5 W"
        }
      },
      {
        title: "Dimensions",
        items: {
          "Largeur": "1134 mm",
          "Longueur": "2278 mm",
          "Épaisseur": "35 mm",
          "Poids": "28,5 kg"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "Panneau photovoltaïque",
          "Puissance": "550 Wc",
          "Technologie": "Monocristallin PERC",
          "Rendement": "21,3%",
          "Dimensions": "2278 × 1134 × 35 mm",
          "Tension max": "49,8 V"
        }
      }
    ]
  },
  {
    id: 7,
    title: "Filtre HEPA H14 (lot de 2)",
    category: "Filtres & accessoires",
    description: "Filtration à 99.995%, compatible VMC.",
    longDescription: "Filtres HEPA H14 de rechange pour assurer la meilleure qualité d'air intérieur, capturant 99.995% des particules fines, des bactéries et des virus.",
    price: "450",
    image: "/images/products/filtre-hepa-h14.jpg",
    reference: "FIL-HEPA-H14-2",
    brand: "Air Froid Expert",
    warranty: "1 an",
    features: [
      "Filtration ultrafine des particules",
      "Capture des allergènes et pollens",
      "Réduction des bactéries et virus",
      "Compatible VMC double flux",
      "Installation rapide et facile",
      "Durée de vie : 12 à 18 mois"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Marque": "Air Froid Expert",
          "Code produit": "FIL-HEPA-H14-2",
          "Classe": "HEPA H14",
          "Efficacité": "99,995%",
          "Contenu": "Lot de 2 filtres",
          "Durée de vie estimée": "12 – 18 mois"
        }
      },
      {
        title: "Dimensions",
        items: {
          "Largeur": "300 mm",
          "Hauteur": "200 mm",
          "Profondeur": "50 mm"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "Filtre HEPA",
          "Classe": "H14",
          "Efficacité": "99,995%",
          "Matériau": "Fibres de verre microfibres",
          "Cadre": "Carton résistant",
          "Contenu": "Lot de 2 filtres"
        }
      }
    ]
  },
  {
    id: 8,
    title: "Thermostat Intelligent WiFi",
    category: "Filtres & accessoires",
    description: "Contrôle à distance, programmation horaire.",
    longDescription: "Contrôlez la température de votre maison depuis votre smartphone. Ce thermostat intelligent apprend de vos habitudes pour optimiser votre confort tout en réalisant des économies d'énergie.",
    price: "1 800",
    image: "/images/products/thermostat-wifi.jpg",
    badge: "Nouveau",
    reference: "TH-WIFI-SMART",
    brand: "SmartClim",
    warranty: "2 ans",
    features: [
      "Contrôle à distance via application",
      "Programmation hebdomadaire personnalisable",
      "Apprentissage automatique des habitudes",
      "Alertes et rapports de consommation",
      "Compatible Google Home et Alexa",
      "Géolocalisation pour activation auto"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Marque": "SmartClim",
          "Code produit": "TH-WIFI-SMART",
          "Connectivité": "WiFi 2,4 GHz",
          "Compatibilité": "iOS / Android",
          "Alimentation": "2 piles AA / Câble 24V"
        }
      },
      {
        title: "Dimensions",
        items: {
          "Largeur": "86 mm",
          "Hauteur": "86 mm",
          "Profondeur": "25 mm",
          "Poids": "120 g"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "Thermostat intelligent",
          "Connectivité": "WiFi 2,4 GHz",
          "Écran": "LCD tactile rétroéclairé",
          "Température": "0 – 40°C (plage réglable)",
          "Alimentation": "2 piles AA / Câble 24V",
          "Compatible": "Google Home, Alexa"
        }
      }
    ]
  },
  {
    id: 9,
    title: "Extracteur d'Air 150mm",
    category: "Équipements de ventilation",
    description: "Débit 350 m³/h, ultra-silencieux.",
    longDescription: "Extracteur d'air tubulaire puissant et silencieux, idéal pour la ventilation des pièces humides ou comme renfort sur un réseau existant.",
    price: "1 200",
    image: "/images/products/extracteur-axe-150.jpg",
    reference: "EXT-150-SIL",
    brand: "Air Froid Expert",
    warranty: "2 ans",
    features: [
      "Moteur à roulements à billes longue durée",
      "Palette aérodynamique ultra-silencieuse",
      "Clapet anti-retour intégré",
      "Installation en ligne ou murale",
      "Grille de protection incluse",
      "Faible consommation électrique"
    ],
    specSections: [
      {
        title: "Autres caractéristiques",
        items: {
          "Marque": "Air Froid Expert",
          "Code produit": "EXT-150-SIL",
          "Fréquence": "50 Hz",
          "Tension": "220-240 V",
          "Niveau sonore": "28 dB",
          "Vitesse": "1 vitesse"
        }
      },
      {
        title: "Dimensions",
        items: {
          "Diamètre": "150 mm",
          "Longueur": "180 mm",
          "Poids": "1,2 kg"
        }
      },
      {
        title: "Caractéristiques",
        items: {
          "Type": "Extracteur tubulaire",
          "Diamètre": "150 mm",
          "Débit max": "350 m³/h",
          "Niveau sonore": "28 dB",
          "Puissance": "35 W",
          "Alimentation": "220-240V / 50Hz"
        }
      }
    ]
  }
];
