import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import HomeMain from "./HomeMain";
import LandingHeader from "./LandingHeader";
import StatsSection from "./StatsSection";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import WritingAreaSection from "./WritingAreaSection";
import RoadmapSection from "./RoadmapSection";
import apiClient from "app/hooks/apiClient";
import Loading from "app/components/MatxLoading";

export default function LandingMain() {
  const words = ["GST", "Income Tax"];
  const [index, setIndex] = useState(0);

  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1200);

    const fetchLanding = async () => {
      try {
        setLoading(true);

        const { data } = await apiClient.get("/landing/");
        setLandingData(data);

      } catch (error) {
        console.error("Landing API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanding();

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ✅ LOADING STATE (IMPORTANT)
  if (loading || !landingData) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        color: "#fff",
        overflowX: "hidden",
        background: `
          radial-gradient(circle at 10% 20%, rgba(255,0,80,0.25), transparent 40%),
          radial-gradient(circle at 90% 30%, rgba(255,80,120,0.15), transparent 40%),
          radial-gradient(circle at 50% 90%, rgba(255,0,60,0.15), transparent 50%),
          linear-gradient(135deg, #120006 0%, #2B0008 40%, #8B0016 100%)
        `,
      }}
    >
      <LandingHeader scrollToSection={scrollToSection} />

      <HomeMain data={landingData.banner} />
      <StatsSection data={landingData.counters} />
      <WritingAreaSection data={landingData.services} />
      <RoadmapSection data={landingData.roadmap_steps} />
      <PricingSection data={landingData.pricing_plans} />
      <ContactSection data={landingData.contact} />
      <FAQSection data={landingData.faqs} />
      <Footer data={landingData.legal_content} scrollToSection={scrollToSection}/>
    </Box>
  );
}