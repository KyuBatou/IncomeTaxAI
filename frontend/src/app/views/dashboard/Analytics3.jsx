import { Box, Button, Container, Grid, Typography } from "@mui/material";
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

export default function LandingMain() {
  const words = ["GST", "Income Tax"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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


      <LandingHeader
        scrollToSection={scrollToSection} 
      />

      <HomeMain />
      
      <StatsSection />

      <WritingAreaSection />

      <RoadmapSection />

      <PricingSection />

      <FAQSection />

      <ContactSection />

      <Footer />

    </Box>
  );
}
