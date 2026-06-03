import { ServiceDetailPage } from "@/components/services/ServiceDetailPage";

export const metadata = {
  title: "Ventilation | Air Froid Expert",
  description: "Extraction et traitement de l'air pour garantir un environnement sain.",
};

export default function VentilationPage() {
  return <ServiceDetailPage slug="ventilation" />;
}
