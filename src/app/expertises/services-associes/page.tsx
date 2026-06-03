import { ServiceDetailPage } from "@/components/services/ServiceDetailPage";

export const metadata = {
  title: "Services Associés | Air Froid Expert",
  description: "Accompagnement, maintenance et support technique réactif.",
};

export default function ServicesAssociesPage() {
  return <ServiceDetailPage slug="services-associes" />;
}
