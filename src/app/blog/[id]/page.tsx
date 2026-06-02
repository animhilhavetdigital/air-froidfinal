import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { notFound } from "next/navigation";

// We copy the mock data here for simplicity, in a real app this would be fetched from an API or DB.
const ARTICLES = [
  {
    id: 1,
    title: "Comment bien choisir sa climatisation pour une villa ?",
    excerpt: "Découvrez nos conseils d'experts pour dimensionner et choisir le système de climatisation idéal pour les grands espaces résidentiels au Maroc.",
    content: "Le choix d'une climatisation pour une villa est une étape cruciale pour garantir le confort thermique de votre habitation tout au long de l'année. Plusieurs facteurs doivent être pris en compte : la superficie des pièces, l'orientation de la maison, l'isolation thermique, et bien sûr votre budget. \n\nIl est recommandé d'opter pour des systèmes gainables ou des pompes à chaleur air-air multisplits qui offrent une excellente répartition de l'air et sont souvent plus esthétiques. De plus, faire appel à un professionnel pour réaliser un bilan thermique vous assurera de choisir un équipement adapté à vos besoins spécifiques.",
    category: "Climatisation",
    date: "12 Mai 2026",
    author: "Équipe Technique",
    image: "/images/blog/1.jpg", // Using one of the images copied earlier as fallback, assuming original assets might be missing or to use the user's images
    readTime: "5 min"
  },
  {
    id: 2,
    title: "L'importance de la VMC dans les Services Associés professionnelles",
    excerpt: "Normes d'hygiène, extraction des graisses et confort du personnel : pourquoi une bonne ventilation est cruciale pour votre restaurant.",
    content: "Dans une Services Associés professionnelle, la ventilation n'est pas qu'une question de confort, c'est une obligation légale et sanitaire. Une bonne VMC (Ventilation Mécanique Contrôlée) permet d'évacuer les odeurs, les fumées, mais surtout les graisses en suspension qui représentent un risque d'incendie majeur.\n\nUne hotte professionnelle performante, associée à un réseau d'extraction bien dimensionné, garantit un environnement de travail sain pour votre brigade et préserve la qualité de l'air dans la salle de restaurant.",
    category: "Ventilation",
    date: "28 Avril 2026",
    author: "Sarah Bennani",
    image: "/images/blog/2.jpg",
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Guide complet : L'énergie solaire photovoltaïque en 2026",
    excerpt: "Tout ce que vous devez savoir avant de passer à l'énergie solaire : rentabilité, installation et subventions disponibles.",
    content: "L'énergie solaire connaît un essor fulgurant, et 2026 marque un tournant avec des technologies photovoltaïques toujours plus performantes et accessibles. Installer des panneaux solaires permet non seulement de réduire drastiquement sa facture énergétique, mais aussi de valoriser son patrimoine immobilier.\n\nAvant de vous lancer, il est essentiel de bien évaluer votre consommation, l'ensoleillement de votre toiture et de vous renseigner sur les aides locales. Un onduleur de qualité et des batteries de stockage peuvent également maximiser votre indépendance énergétique.",
    category: "Solaire",
    date: "15 Avril 2026",
    author: "Karim Tazi",
    image: "/images/blog/3.jpg",
    readTime: "10 min"
  },
  {
    id: 4,
    title: "5 conseils pour entretenir votre pompe à chaleur avant l'hiver",
    excerpt: "Prolongez la durée de vie de votre équipement et optimisez ses performances avec ces gestes simples de maintenance préventive.",
    content: "L'entretien d'une pompe à chaleur est indispensable pour garantir son bon fonctionnement et éviter les pannes en plein hiver. \n\n1. Nettoyez régulièrement l'unité extérieure pour dégager les feuilles et débris.\n2. Vérifiez la pression du circuit hydraulique.\n3. Nettoyez ou remplacez les filtres de l'unité intérieure.\n4. Assurez-vous que les bouches d'insufflation ne sont pas obstruées.\n5. Faites appel à un professionnel pour un entretien annuel complet, obligatoire pour conserver la garantie.",
    category: "Guides de maintenance",
    date: "02 Avril 2026",
    author: "Service SAV",
    image: "/images/blog/1.jpg",
    readTime: "4 min"
  },
  {
    id: 5,
    title: "Air Froid Expert ouvre un nouveau showroom à Tanger",
    excerpt: "Retrouvez-nous désormais dans la région nord ! Découvrez nos installations en conditions réelles dans notre nouvel espace dédié.",
    content: "Nous sommes fiers d'annoncer l'ouverture de notre tout nouveau showroom à Tanger, situé au cœur de la zone industrielle. Cet espace moderne a été conçu pour vous permettre de découvrir nos dernières solutions de climatisation, de ventilation et de réfrigération industrielle en conditions réelles de fonctionnement.\n\nNotre équipe d'experts est à votre disposition sur place pour étudier vos projets et vous conseiller sur les meilleurs équipements adaptés à vos besoins. Venez nous rendre visite !",
    category: "Actualités",
    date: "20 Mars 2026",
    author: "Direction",
    image: "/images/blog/2.jpg",
    readTime: "2 min"
  },
  {
    id: 6,
    title: "Les étapes clés d'une installation thermique réussie",
    excerpt: "De l'étude de faisabilité à la mise en service, découvrez notre processus d'installation rigoureux pour garantir votre confort.",
    content: "Une installation thermique réussie repose sur une méthodologie stricte et éprouvée. Tout commence par une étude de faisabilité approfondie sur site, suivie de la conception des plans et du choix des équipements. \n\nL'installation elle-même est réalisée par nos techniciens qualifiés dans le respect des normes en vigueur. Enfin, la mise en service et le réglage minutieux des appareils assurent une performance optimale dès les premiers jours d'utilisation.",
    category: "Conseils d'installation",
    date: "10 Mars 2026",
    author: "Équipe Projet",
    image: "/images/blog/3.jpg",
    readTime: "6 min"
  }
];

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = ARTICLES.find((a) => a.id === parseInt(resolvedParams.id));

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
        
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#10748E] transition-colors font-montserrat font-semibold text-sm mb-8">
          <ArrowLeft size={16} /> Retour au blog
        </Link>

        <div className="mb-8">
          <span className="px-3 py-1 bg-[#10748E]/10 text-[#10748E] font-nevan tracking-widest uppercase text-xs rounded-lg shadow-sm mb-4 inline-block">
            {article.category}
          </span>
          <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-montserrat text-gray-500 uppercase tracking-wide font-semibold border-b border-gray-200 pb-6">
            <span className="flex items-center gap-2"><Calendar size={16} className="text-[#10748E]" /> {article.date}</span>
            <span className="flex items-center gap-2"><User size={16} className="text-[#10748E]" /> {article.author}</span>
            <span className="flex items-center gap-2"><Clock size={16} className="text-[#10748E]" /> {article.readTime}</span>
          </div>
        </div>

        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-lg">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="font-montserrat text-gray-700 text-lg leading-relaxed space-y-6 max-w-3xl mx-auto">
          <p className="font-semibold text-xl text-gray-900 mb-8 border-l-4 border-[#10748E] pl-6">
            {article.excerpt}
          </p>
          
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      </div>
    </div>
  );
}
