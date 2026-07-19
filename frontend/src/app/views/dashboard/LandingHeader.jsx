import { Box, Button, Container, styled, Typography } from "@mui/material";
import { MatxLogo, MatxMenu } from "app/components";
import MenuItem from "@mui/material/MenuItem";
import { Span } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { Link } from "react-router-dom";
import { Home, Person, PowerSettingsNew } from "@mui/icons-material";

const navItems = ["home", "about", "pricing", "contact", "faq",];

const UserMenu = styled("div")({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));

export default function LandingHeader({ scrollToSection }) {
  const { logout, user } = useAuth();

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
          py: .5,
        }}
      >
        {/* ================= LOGO ================= */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MatxLogo />
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
        </Box>

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
        {!user ? (
          <Button
            onClick={() => (window.location.href = "/session/signin")}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 50,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              textTransform: "none",
              background: "linear-gradient(90deg,#ff2d55,#ff4d6d,#ff6b81)",
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
        ) : (
          <Box display="flex" alignItems="center">
            <MatxMenu
              menuButton={
                <UserMenu>
                  <Span>
                    Hi <strong>{user.name}</strong>
                  </Span>
                </UserMenu>
              }
            >
              <StyledItem>
                <Link to="/">
                  <Home />
                  <Span sx={{ marginInlineStart: 1 }}>Home</Span>
                </Link>
              </StyledItem>

              <StyledItem>
                <Link to="/user-setting">
                  <Person />
                  <Span sx={{ marginInlineStart: 1 }}>Profile</Span>
                </Link>
              </StyledItem>

              <StyledItem>
                <Link to="/gst">
                  <Person />
                  <Span sx={{ marginInlineStart: 1 }}>Start Chat</Span>
                </Link>
              </StyledItem>

              <StyledItem onClick={logout}>
                <PowerSettingsNew />
                <Span sx={{ marginInlineStart: 1 }}>Logout</Span>
              </StyledItem>
            </MatxMenu>
          </Box>
        )}
      </Container>
    </Box>
  );
}