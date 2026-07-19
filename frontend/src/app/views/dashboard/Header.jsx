import { Box, Button, Container, Typography } from "@mui/material";
import { MatxLogo } from "app/components";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const navItems = ["home", "about", "pricing", "contact", "faq"];

export default function LandingHeader({ scrollToSection }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (section) => {
    // If already on landing page
    if (location.pathname === "/") {
      scrollToSection?.(section);
      return;
    }

    // Otherwise go to landing page and remember section
    navigate("/", {
      state: {
        scrollTo: section,
      },
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
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
          py: 0.5,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <Link to="/gst"> */}
            <MatxLogo />

            <Typography
              onClick={() => handleNavigation("home")}
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
          {/* </Link> */}
        </Box>

        {/* Navigation */}
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
              onClick={() => handleNavigation(item)}
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

        {/* Button */}
        <Button
          onClick={() => navigate("/session/signin")}
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

            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 0 40px rgba(255,77,109,.6)",
            },
          }}
        >
          Start Chat
        </Button>
      </Container>
    </Box>
  );
}