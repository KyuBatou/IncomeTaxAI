import { Box, Container, Grid, Typography } from "@mui/material";

// map icon string → MUI icon
import BalanceIcon from "@mui/icons-material/Balance";
import GavelIcon from "@mui/icons-material/Gavel";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionIcon from "@mui/icons-material/Description";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteIcon from "@mui/icons-material/EditNote";

export default function WritingAreaSection({ data = [] }) {

  const getIcon = (icon) => {
    switch (icon) {
      case "far fa-brain":
        return <AutoAwesomeIcon />;
      case "far fa-chart-line":
        return <GavelIcon />;
      case "fal fa-lightbulb-on":
        return <SummarizeIcon />;
      case "far fa-search":
        return <SearchIcon />;
      case "far fa-edit":
        return <EditNoteIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  return (
    <Box
      sx={{
        py: 12,
        position: "relative",
        background:
          "radial-gradient(circle at top, rgba(255,77,109,.08), transparent 60%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box textAlign="center" mb={8}>
          <Typography
            sx={{
              fontSize: { xs: 30, md: 48 },
              fontWeight: 900,
              color: "#fff",
            }}
          >
            Start writing <span style={{ color: "#ff4d6d" }}>10x faster</span> with AI
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "rgba(255,255,255,.65)",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Powerful AI tools built for tax professionals, lawyers, and CAs to
            simplify legal research, drafting, and case law analysis.
          </Typography>
        </Box>

        {/* CARDS */}
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
                  border: "1px solid rgba(255,255,255,.08)",
                  backdropFilter: "blur(20px)",
                  transition: "0.35s",

                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: "#ff4d6d",
                    boxShadow: "0 25px 60px rgba(255,77,109,.25)",
                  },

                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background:
                      "linear-gradient(90deg,#ff2d55,#ff4d6d,#ff8fa3)",
                  },
                }}
              >
                {/* ICON */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg,#ff2d55,#ff6b81)",
                    color: "#fff",
                    mb: 3,
                    boxShadow: "0 10px 25px rgba(255,77,109,.35)",
                  }}
                >
                  {getIcon(item.icon_link)}
                </Box>

                {/* TITLE */}
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 800,
                    mb: 1,
                    color: "#fff",
                  }}
                >
                  {item.title}
                </Typography>

                {/* DESCRIPTION */}
                <Typography
                  sx={{
                    textAlign: 'justify',
                    color: "rgba(255,255,255,.65)",
                    lineHeight: 1.8,
                    fontSize: 14,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}