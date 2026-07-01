import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";

import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

export default function Footer() {
  const links = [
    "Home",
    "About",
    "Pricing",
    "FAQ",
    "Contact",
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
        background:
          "linear-gradient(180deg,#35000C 0%,#230007 100%)",
        borderTop: "1px solid rgba(255,255,255,.08)",
      }}
    >
      {/* Glow */}
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
            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#fff,#ff8fa3,#ff4d6d)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
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

            <Stack direction="row" spacing={1.5} mt={4}>
              {[FacebookRoundedIcon, LinkedInIcon, XIcon, InstagramIcon].map(
                (Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(255,255,255,.08)",
                      backdropFilter: "blur(20px)",
                      transition: ".3s",

                      "&:hover": {
                        bgcolor: "#ff4d6d",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                )
              )}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={3}>
              Quick Links
            </Typography>

            <Stack spacing={2}>
              {links.map((item) => (
                <Typography
                  key={item}
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

          {/* Products */}
          <Grid item xs={6} md={3}>
            <Typography fontWeight={700} mb={3}>
              Products
            </Typography>

            <Stack spacing={2}>
              {[
                "AI Legal Assistant",
                "Income Tax Research",
                "GST Research",
                "Legal Drafting",
                "Case Law Search",
              ].map((item) => (
                <Typography
                  key={item}
                  sx={{
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
                  support@itl.ai
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <PhoneRoundedIcon sx={{ color: "#ff4d6d" }} />
                <Typography color="rgba(255,255,255,.7)">
                  +91 98765 43210
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <LocationOnRoundedIcon sx={{ color: "#ff4d6d" }} />
                <Typography color="rgba(255,255,255,.7)">
                  New Delhi, India
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

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Typography color="rgba(255,255,255,.5)">
            © 2026 ITL AI. All Rights Reserved.
          </Typography>

          <Stack direction="row" spacing={4}>
            <Typography
              sx={{
                cursor: "pointer",
                color: "rgba(255,255,255,.5)",
                "&:hover": { color: "#ff4d6d" },
              }}
            >
              Privacy Policy
            </Typography>

            <Typography
              sx={{
                cursor: "pointer",
                color: "rgba(255,255,255,.5)",
                "&:hover": { color: "#ff4d6d" },
              }}
            >
              Terms of Service
            </Typography>

            <Typography
              sx={{
                cursor: "pointer",
                color: "rgba(255,255,255,.5)",
                "&:hover": { color: "#ff4d6d" },
              }}
            >
              Cookies
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}