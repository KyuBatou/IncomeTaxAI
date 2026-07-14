import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { useNavigate } from "react-router-dom";
import { MatxLogo } from "app/components";

export default function Footer({ data, scrollToSection }) {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Pricing", id: "pricing" },
    { label: "Contact", id: "contact" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <Box
      sx={{
        mt: 10,
        pt: 10,
        pb: 4,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg,#35000C 0%,#230007 100%)",
        borderTop: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "#ff4d6d22",
          filter: "blur(120px)",
          top: -250,
          right: -150,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <MatxLogo />

            <Typography
              sx={{
                textAlign: "center",
                fontSize: 32,
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#fff,#ff8fa3,#ff4d6d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mt: 2,
              }}
            >
              ITL AI
            </Typography>

            <Typography
              sx={{
                mt: 2,
                color: "rgba(255,255,255,.65)",
                lineHeight: 1.8,
              }}
            >
              AI-powered legal research, drafting and intelligent tax
              assistance for Chartered Accountants, Advocates and Tax
              Professionals.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={3}>
              Quick Links
            </Typography>

            <Stack spacing={2}>
              {quickLinks.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  sx={{
                    cursor: "pointer",
                    color: "rgba(255,255,255,.65)",
                    transition: ".3s",
                    "&:hover": {
                      color: "#ff4d6d",
                      pl: 1,
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Products */}
          <Grid item xs={6} md={3}>
            <Typography fontWeight={700} mb={3}>
              GST Products
            </Typography>

            <Stack spacing={2}>
              {[
                "Case Law Search",
                "Notice Reply",
                "Summerizer",
                "Ask Bot",
              ].map((item) => (
                <Typography
                  key={item}
                  onClick={() => (window.location.href = "/gst")}
                  sx={{
                    cursor: "pointer",
                    color: "rgba(255,255,255,.65)",
                    transition: ".3s",
                    "&:hover": {
                      color: "#ff4d6d",
                      pl: 1,
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={3}>
            <Typography fontWeight={700} mb={3}>
              Contact
            </Typography>

            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2}>
                <EmailRoundedIcon sx={{ color: "#ff4d6d" }} />
                <Typography color="rgba(255,255,255,.7)">
                  info@incometaxlibrary.com
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <PhoneRoundedIcon sx={{ color: "#ff4d6d" }} />
                <Typography color="rgba(255,255,255,.7)">
                  +91 9001597011
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <LocationOnRoundedIcon sx={{ color: "#ff4d6d" }} />
                <Typography color="rgba(255,255,255,.7)">
                  Jaipur, Rajasthan, India
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 6,
            borderColor: "rgba(255,255,255,.08)",
          }}
        />

        {/* Legal Links */}
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Typography color="rgba(255,255,255,.5)">
              © 2026 ITL AI. All Rights Reserved.
            </Typography>

            <Stack direction="row" spacing={4} flexWrap="wrap">
              {data?.map((item) => (
                <Typography
                  key={item.id}
                  onClick={() => navigate(`/content/${item.slug}`)}
                  sx={{
                    cursor: "pointer",
                    color: "rgba(255,255,255,.5)",
                    transition: ".3s",
                    "&:hover": {
                      color: "#ff4d6d",
                    },
                  }}
                >
                  {item.section}
                </Typography>
              ))}
            </Stack>
          </Stack>

          {/* Developer Credit */}
          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
              color: "rgba(255,255,255,.45)",
              fontSize: 14,
            }}
          >
            ITL AI - Designed, Developed and Delivered by{" "}
            <a
              href="https://incometaxlibrary.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#ff4d6d",
                textDecoration: "underline",
              }}
            >
              Income Tax Library
            </a>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}