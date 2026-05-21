import { HeroBanner } from "@/components/home/HeroBanner";
import { ResolvedIssuesSection } from "@/components/home/ResolvedIssuesSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import {
  NeighborhoodImpactSection,
  SafetyStandardsSection,
} from "@/components/home/ExtraSections";

export function HomePage() {
  return (
    <>
      <HeroBanner />
      <ResolvedIssuesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <NeighborhoodImpactSection />
      <SafetyStandardsSection />
    </>
  );
}
