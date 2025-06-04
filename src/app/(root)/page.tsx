import HeroSection from "@/components/HeroComponent/HeroSection"
import TrustSignals from "@/components/TrustSignalsComponents/TrustSignals"
import QuickServicesOverview from "@/components/ServicesOverview/QuickServicesOverview"

export default function Home() {
  return (
    <main className="">
      <HeroSection />
      <QuickServicesOverview />
      <TrustSignals />
    </main>
  )
}
