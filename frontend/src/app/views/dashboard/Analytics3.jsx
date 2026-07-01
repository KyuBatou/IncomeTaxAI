import { Fragment } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Analytics() {
  const features = [
    {
      icon: <ChatIcon color="primary" sx={{ fontSize: 40 }} />,
      title: "AI Legal Assistant",
      desc: "Ask legal questions and receive AI-powered guidance in seconds.",
    },
    {
      icon: <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />,
      title: "Draft Documents",
      desc: "Generate notices, agreements, replies, petitions and legal drafts.",
    },
    {
      icon: <GavelIcon color="primary" sx={{ fontSize: 40 }} />,
      title: "Legal Research",
      desc: "Search laws, acts, judgments and legal references efficiently.",
    },
  ];

  return (
    <Fragment>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Hero */}
        <Card
          sx={{
            p: 6,
            borderRadius: 4,
            background:
              "linear-gradient(135deg,#1976d2 0%,#42a5f5 100%)",
            color: "#fff",
            mb: 5,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                AI Legal Assistant
              </Typography>

              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mb: 4 }}
              >
                Generate legal drafts, analyze documents, answer legal
                questions and improve productivity using Artificial
                Intelligence.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Chat
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    "&:hover": {
                      borderColor: "#fff",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <AutoAwesomeIcon
                  sx={{
                    fontSize: 180,
                    opacity: 0.9,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Features */}
        <Typography
          variant="h4"
          fontWeight={600}
          textAlign="center"
          mb={4}
        >
          What You Can Do
        </Typography>

        <Grid container spacing={3}>
          {features.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent>
                  {item.icon}

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mt={2}
                    mb={1}
                  >
                    {item.title}
                  </Typography>

                  <Typography color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <Grid container spacing={3} mt={3}>
          {[
            ["10K+", "Legal Drafts Generated"],
            ["500+", "Organizations"],
            ["99.9%", "Availability"],
            ["24×7", "AI Assistance"],
          ].map(([value, label]) => (
            <Grid item xs={6} md={3} key={label}>
              <Card sx={{ p: 3, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  color="primary"
                  fontWeight={700}
                >
                  {value}
                </Typography>

                <Typography color="text.secondary">
                  {label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Box
          sx={{
            mt: 6,
            py: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Ready to simplify legal work?
          </Typography>

          <Typography color="text.secondary" mt={1} mb={3}>
            Start generating legal drafts and get AI-powered legal
            assistance today.
          </Typography>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Fragment>
  );
}