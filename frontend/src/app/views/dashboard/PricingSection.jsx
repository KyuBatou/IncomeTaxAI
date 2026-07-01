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
  
  const plans = [
    {
      title: "Starter",
      price: "₹999",
      subtitle: "/month",
      color: "#00C2FF",
      features: [
        "100 AI Queries",
        "Income Tax Research",
        "GST Research",
        "AI Legal Assistant",
      ],
    },
    {
      title: "Professional",
      price: "₹2,499",
      subtitle: "/month",
      color: "#ff4d6d",
      popular: true,
      features: [
        "Unlimited AI Queries",
        "Legal Drafting",
        "Case Law Search",
        "Document Analysis",
        "Priority Support",
      ],
    },
    {
      title: "Enterprise",
      price: "Custom",
      subtitle: "",
      color: "#7C4DFF",
      features: [
        "Unlimited Users",
        "Dedicated Success Manager",
        "Custom AI Models",
        "REST API Access",
        "On-premise Deployment",
      ],
    },
  ];
  
  export default function PricingSection() {
    return (
      <Box
        id="pricing"
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
            Simple, transparent pricing designed for Chartered Accountants,
            Advocates, Tax Professionals and Enterprises.
          </Typography>
  
          <Grid container spacing={4}>
            {plans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.title}>
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
  
                    border: plan.popular
                      ? `1px solid ${plan.color}`
                      : "1px solid rgba(255,255,255,.08)",
  
                    transition: ".4s",
  
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: `0 30px 60px ${plan.color}35`,
                      borderColor: plan.color,
                    },
  
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at top right, ${plan.color}25, transparent 55%)`,
                    },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="MOST POPULAR"
                      sx={{
                        position: "absolute",
                        right: 20,
                        top: 20,
                        background: plan.color,
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    />
                  )}
  
                  <CardContent
                    sx={{
                      p: 5,
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 26,
                        fontWeight: 700,
                      }}
                    >
                      {plan.title}
                    </Typography>
  
                    <Stack
                      direction="row"
                      alignItems="flex-end"
                      spacing={1}
                      mt={3}
                    >
                      <Typography
                        sx={{
                          fontSize: 52,
                          fontWeight: 800,
                          color: plan.color,
                        }}
                      >
                        {plan.price}
                      </Typography>
  
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,.6)",
                          mb: 1,
                        }}
                      >
                        {plan.subtitle}
                      </Typography>
                    </Stack>
  
                    <Stack spacing={2.2} mt={5}>
                      {plan.features.map((item) => (
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          key={item}
                        >
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: `${plan.color}20`,
                            }}
                          >
                            <CheckCircleRoundedIcon
                              sx={{
                                color: plan.color,
                                fontSize: 20,
                              }}
                            />
                          </Box>
  
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,.85)",
                            }}
                          >
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
  
                    <Button
                      fullWidth
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        mt: 6,
                        py: 1.7,
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
  
                        background: plan.popular
                          ? `linear-gradient(90deg,${plan.color},#ff6b81)`
                          : "rgba(255,255,255,.08)",
  
                        border: plan.popular
                          ? "none"
                          : "1px solid rgba(255,255,255,.15)",
  
                        "&:hover": {
                          background: `linear-gradient(90deg,${plan.color},#ff6b81)`,
                        },
                      }}
                    >
                      {plan.title === "Enterprise"
                        ? "Contact Sales"
                        : "Get Started"}
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