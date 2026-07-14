import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "app/components/MatxLoading";

import apiClient from "app/hooks/apiClient";
import { fetchContentDetail } from "./services/apiService";
import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer";

export default function LegalContentPage() {
  const { slug } = useParams();

  const [landingData, setLandingData] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [landingRes, contentRes] = await Promise.all([
          apiClient.get("/landing/"),
          fetchContentDetail(slug),
        ]);

        setLandingData(landingRes.data);
        setContent(contentRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  if (loading || !landingData) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "#fff",
        background: `
          radial-gradient(circle at 10% 20%, rgba(255,0,80,0.25), transparent 40%),
          radial-gradient(circle at 90% 30%, rgba(255,80,120,0.15), transparent 40%),
          radial-gradient(circle at 50% 90%, rgba(255,0,60,0.15), transparent 50%),
          linear-gradient(135deg,#120006 0%,#2B0008 40%,#8B0016 100%)
        `,
      }}
    >
      <Header scrollToSection={scrollToSection} />

        <Box
          sx={{
            borderRadius: 3,
            p: 15,
          }}
        >
          <Typography
            variant="h3"
            align="center"
            fontWeight={700}
            gutterBottom
          >
            {content?.section}
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography
            component="div"
            dangerouslySetInnerHTML={{
              __html: content?.legal_content,
            }}
          />
        </Box>

      <Footer
        data={landingData.legal_content}
        scrollToSection={scrollToSection}
      />
    </Box>
  );
}