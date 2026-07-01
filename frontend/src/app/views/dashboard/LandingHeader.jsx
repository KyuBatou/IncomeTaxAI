import { Box, Button, Container, Typography } from "@mui/material";

const navItems = ["home", "about", "pricing", "faq", "contact"];

export default function LandingHeader({ scrollToSection }) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,

        /* AI GLASS EFFECT */
        backdropFilter: "blur(18px)",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.25))",

        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1.5,
        }}
      >
        {/* ================= LOGO ================= */}
        <Typography
          onClick={() => scrollToSection("home")}
          sx={{
            fontWeight: 900,
            fontSize: 20,
            cursor: "pointer",
            letterSpacing: 1,

            background:
              "linear-gradient(90deg,#ff4d6d,#ff8fa3,#ffb3c1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",

            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          ITL AI
        </Typography>

        {/* ================= NAV LINKS ================= */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 4,
            alignItems: "center",
          }}
        >
          {navItems.map((item) => (
            <Box
              key={item}
              onClick={() => scrollToSection(item)}
              sx={{
                cursor: "pointer",
                position: "relative",
                fontSize: 14,
                color: "rgba(255,255,255,0.75)",
                textTransform: "capitalize",
                transition: "0.3s",

                "&:hover": {
                  color: "#ff4d6d",
                },

                /* underline animation */
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: -4,
                  width: "0%",
                  height: "2px",
                  background:
                    "linear-gradient(90deg,#ff4d6d,#ff8fa3)",
                  transition: "0.3s",
                  borderRadius: 2,
                },

                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              {item}
            </Box>
          ))}
        </Box>

        {/* ================= CTA BUTTON ================= */}
        <Button
          onClick={() => scrollToSection("home")}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 50,
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            textTransform: "none",

            background:
              "linear-gradient(90deg,#ff2d55,#ff4d6d,#ff6b81)",

            boxShadow: "0 0 25px rgba(255,77,109,0.35)",

            transition: "0.3s",

            "&:hover": {
              transform: "translateY(-2px) scale(1.05)",
              boxShadow: "0 0 40px rgba(255,77,109,0.6)",
            },
          }}
        >
          Start Chat
        </Button>
      </Container>
    </Box>
  );
}