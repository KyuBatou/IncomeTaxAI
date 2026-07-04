import CountUp from "react-countup";
import { Box, Container, Grid, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import BalanceIcon from "@mui/icons-material/Balance";
import GroupsIcon from "@mui/icons-material/Groups";

export default function StatsSection({ data = [] }) {
  // map backend → icons (since backend doesn’t send icons)
  const getIcon = (title) => {
    if (title?.toLowerCase().includes("income")) return <BalanceIcon sx={{ fontSize: 42 }} />;
    if (title?.toLowerCase().includes("gst")) return <GavelIcon sx={{ fontSize: 42 }} />;
    return <GroupsIcon sx={{ fontSize: 42 }} />;
  };

  return (
    <Box
      id="about"
      sx={{
        py: 8,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{
            fontSize: { xs: 36, md: 50 },
            fontWeight: 800,
            textAlign: "center",
            mb: 2,
            background: "linear-gradient(90deg,#fff,#ff8fa3,#ff4d6d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Trusted by Tax Professionals
        </Typography>

        <Typography
          textAlign="center"
          sx={{
            color: "rgba(255,255,255,.65)",
            maxWidth: 700,
            mx: "auto",
            mb: 7,
          }}
        >
          Built with one of India's largest legal and taxation knowledge databases
          to deliver accurate AI-powered research and drafting.
        </Typography>

        <Grid container spacing={4}>
          {data?.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <Box
                sx={{
                  height: "100%",
                  p: 4,
                  borderRadius: 5,
                  position: "relative",
                  overflow: "hidden",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,.08)",
                  transition: ".35s",

                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: "#ff4d6d",
                    boxShadow: "0 20px 45px rgba(255,77,109,.25)",
                  },

                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background:
                      "linear-gradient(90deg,#ff2d55,#ff4d6d,#ff8fa3)",
                  },
                }}
              >
                {/* ICON */}
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg,#ff2d55,#ff6b81)",
                    color: "#fff",
                    mb: 3,
                    boxShadow: "0 12px 30px rgba(255,77,109,.35)",
                  }}
                >
                  {getIcon(item.title)}
                </Box>

                {/* COUNT */}
                <Typography sx={{ fontSize: 42, fontWeight: 800, mb: 1 }}>
                  <CountUp
                    end={parseInt(item.count)}
                    duration={3}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  +
                </Typography>

                {/* TITLE */}
                <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                  {item.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}