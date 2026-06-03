export const SITE_NAME = "AIR FROID EXPERT";
export const SITE_TAGLINE = "L'Excellence Climatique au Maroc";
export const SITE_DESCRIPTION =
  "Solutions professionnelles de climatisation, énergie solaire, ventilation et Services Associés professionnelles. Installation, maintenance et service premium au Maroc.";

export const WHATSAPP_NUMBER = "212600000000"; // Replace with real number
export const WHATSAPP_DEFAULT_MESSAGE =
  "Bonjour, je souhaite obtenir des informations sur vos services.";

export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Présentation", href: "/presentation" },
  {
    label: "Services & Solutions",
    href: "/expertises",
    children: [
      { label: "Climatisation", href: "/expertises/climatisation" },
      { label: "Ventilation", href: "/expertises/ventilation" },
      { label: "Solaire", href: "/expertises/solaire" },
      { label: "Services Associés", href: "/expertises/services-associes" },
      { label: "Zones de couverture", href: "/expertises/zones-de-couverture" },
    ],
  },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Blog", href: "/blog" },
  { label: "Espace B2B", href: "/b2b" },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Contact us", href: "/contact" },
      { label: "Mentions Légales", href: "/mentions-legales" },
    ],
  },
];

export const FOOTER_LINKS = {
  services: [
    { label: "Climatisation", href: "/expertises/climatisation" },
    { label: "Ventilation", href: "/expertises/ventilation" },
    { label: "Énergie Solaire", href: "/expertises/solaire" },
    { label: "Services Associés", href: "/expertises/services-associes" },
    { label: "Catalogue", href: "/catalogue" },
  ],
  company: [
    { label: "Présentation", href: "/presentation" },
    { label: "Nos engagements", href: "/#engagements" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-confidentialite" },
    { label: "Conditions générales", href: "/cgv" },
    { label: "Politique cookies", href: "/cookies" },
    { label: "RGPD", href: "/rgpd" },
  ],
};

export const CONTACT_INFO = {
  address: "Marrakech, Maroc",
  phone: "+212 6 00 00 00 00",
  email: "contact@airfroidexpert.ma",
  hours: "Lun-Ven: 8h-18h | Sam: 9h-13h",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/airfroidexpert",
  instagram: "https://instagram.com/airfroidexpert",
  linkedin: "https://linkedin.com/company/airfroidexpert",
  youtube: "https://youtube.com/@airfroidexpert",
};

export const STATS = [
  { value: "500+", label: "Clients satisfaits" },
  { value: "15+", label: "Années d'expérience" },
  { value: "1200+", label: "Projets réalisés" },
  { value: "24/7", label: "Support technique" },
];

export const TESTIMONIALS = [
  {
    name: "Mohammed Benali",
    company: "Hôtel Atlas Marrakech",
    text: "AIR FROID EXPERT a transformé notre système de climatisation. Professionnalisme et expertise au rendez-vous.",
    rating: 5,
  },
  {
    name: "Sarah Tazi",
    company: "Restaurant Le Jardin",
    text: "Installation de notre Services Associés professionnelle impeccable. Équipe réactive et compétente.",
    rating: 5,
  },
  {
    name: "Karim Ouazzani",
    company: "Villa Résidentielle",
    text: "Excellente installation solaire. Économies significatives sur notre facture d'énergie dès le premier mois.",
    rating: 5,
  },
  {
    name: "Fatima Zouhairi",
    company: "Clinique Santé Plus",
    text: "Maintenance régulière et service client exemplaire. Nous recommandons vivement AIR FROID EXPERT.",
    rating: 5,
  },
  {
    name: "Ahmed Chraibi",
    company: "Centre Commercial Oasis",
    text: "Projet de ventilation d'envergure livré dans les délais. Résultats au-delà de nos attentes.",
    rating: 5,
  },
  {
    name: "Nadia Berrada",
    company: "Riad Lumière",
    text: "Solutions sur mesure parfaitement adaptées à notre espace. Un vrai partenaire de confiance.",
    rating: 4,
  },
];
