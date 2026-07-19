import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function PricingSection({ data = [] }) {

  return (
    <Box
      id="pricing"
      sx={{
        py: 8,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          sx={{
            fontSize: { xs: 36, md: 50 },
            fontWeight: 800,
            textAlign: "center",
            mb: 2,
            background:
              "linear-gradient(90deg,#fff,#ff8fa3,#ff4d6d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Flexible Pricing
        </Typography>

        <Typography
          textAlign="center"
          sx={{
            color: "rgba(255,255,255,.65)",
            maxWidth: 650,
            mx: "auto",
            mb: 8,
            fontSize: 18,
          }}
        >
          Simple, transparent pricing designed for professionals.
        </Typography>

        <Grid container spacing={4}>
          {data?.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 5,
                  color: "#fff",

                  background:
                    "linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.03))",

                  backdropFilter: "blur(30px)",

                  border: plan.is_popular
                    ? "1px solid #ff4d6d"
                    : "1px solid rgba(255,255,255,.08)",

                  transition: ".4s",

                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: "0 30px 60px rgba(255,77,109,.25)",
                    borderColor: "#ff4d6d",
                  },

                  "&:before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at top right, rgba(255,77,109,.2), transparent 55%)",
                  },
                }}
              >
                {/* POPULAR */}
                {plan.is_popular && (
                  <Chip
                    label="MOST POPULAR"
                    sx={{
                      position: "absolute",
                      right: 20,
                      top: 20,
                      background: "#ff4d6d",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  />
                )}

                <CardContent sx={{ p: 5, position: "relative", zIndex: 2 }}>
                  {/* NAME */}
                  <Typography sx={{ fontSize: 26, fontWeight: 700 }}>
                    {plan.name}
                  </Typography>

                  {/* PRICE */}
                  <Stack direction="row" alignItems="flex-end" spacing={1} mt={3}>
                    <Typography sx={{ fontSize: 52, fontWeight: 800, color: "#ff4d6d" }}>
                      {plan.monthly_price}
                    </Typography>
                  </Stack>

                  {/* SERVICES */}
                  <Typography sx={{ color: "rgba(255,255,255,.6)", mt: 1 }}>
                    {plan.services}
                  </Typography>

                  {/* FEATURES */}
                  <Stack spacing={2.2} mt={5}>
                    {plan.features?.map((f) => (
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        key={f.id}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,77,109,.15)",
                          }}
                        >
                          <CheckCircleRoundedIcon
                            sx={{ color: "#ff4d6d", fontSize: 20 }}
                          />
                        </Box>

                        <Typography sx={{ color: "rgba(255,255,255,.85)" }}>
                          {f.feature_text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* BUTTON */}
                  <Button
                    fullWidth
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => { window.location.href = "/subscribe" }}
                    sx={{
                      mt: 6,
                      py: 1.7,
                      borderRadius: 4,
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#fff",
                      background: plan.is_popular
                        ? "linear-gradient(90deg,#ff4d6d,#ff6b81)"
                        : "rgba(255,255,255,.08)",
                      border: "1px solid rgba(255,255,255,.15)",
                      "&:hover": {
                        background: "linear-gradient(90deg,#ff4d6d,#ff6b81)",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}