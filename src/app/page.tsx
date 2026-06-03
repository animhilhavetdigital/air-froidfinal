import { Hero } from "@/components/home/Hero";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { QuiSommesNousTeaser } from "@/components/home/QuiSommesNousTeaser";
import { PillarsShowcase } from "@/components/home/PillarsShowcase";
import { MarrakechTeaser } from "@/components/home/MarrakechTeaser";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { SocialProofNumbers } from "@/components/home/SocialProofNumbers";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <MarrakechTeaser />
      <QuiSommesNousTeaser />
      <PillarsShowcase />
      <ProductShowcase />
      <SocialProofNumbers />
    </>
  );
}
