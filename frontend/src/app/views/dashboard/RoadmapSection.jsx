import { Box, Container, Grid, Typography } from "@mui/material";

const steps = [
  {
    number: "01",
    title: "Ask Your Question",
    desc: "Type your Income Tax or GST query in natural language.",
    img: "/ai/media/roadmap/ASK_Image_1.png",
  },
  {
    number: "02",
    title: "AI Legal Analysis",
    desc: "AI analyses statutes, case laws, circulars and procedures relevant to your query.",
    img: "/ai/media/roadmap/ASK_Image_2.png",
  },
  {
    number: "03",
    title: "Get a Detailed Answer",
    desc: "Receive citation-backed responses with legal references and practical insights.",
    img: "/ai/media/roadmap/ASK_Image_3.png",
  },
];

export default function RoadmapSection() {
  return (
    <Box
      sx={{
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="md">
        {/* Heading */}
        <Box textAlign="center" mb={12}>
          <Typography
            sx={{
              fontSize: { xs: 30, md: 52 },
              fontWeight: 900,
            }}
          >
            How It Works
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "rgba(255,255,255,.65)",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            A 3-step AI workflow built for tax professionals to convert complex
            legal queries into structured answers instantly.
          </Typography>
        </Box>

        {/* CENTER LINE */}
        <Box
          sx={{
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "2px",
              transform: "translateX(-50%)",
              background:
                "linear-gradient(180deg,#ff2d55,#ff4d6d,#ff8fa3,transparent)",
            },
          }}
        >
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;

            return (
              <Grid
                container
                key={step.number}
                sx={{
                  mb: 12,
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* DOT */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle,#ff4d6d,#ff2d55)",
                    boxShadow: "0 0 25px rgba(255,77,109,.6)",
                    zIndex: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#fff",
                      textAlign: "center",
                      lineHeight: "34px",
                    }}
                  >
                    {step.number}
                  </Typography>
                </Box>

                {/* LEFT SIDE */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: isLeft ? "flex-end" : "flex-start",
                    pr: isLeft ? 6 : 0,
                    pl: isLeft ? 0 : 6,
                  }}
                >
                  {isLeft && (
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 380,
                        borderRadius: 5,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,.08)",
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
                        backdropFilter: "blur(20px)",
                        p: 3,
                      }}
                    >
                      <Typography sx={{ color: "#ff4d6d", fontWeight: 700 }}>
                        STEP {step.number}
                      </Typography>

                      <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 1 }}>
                        {step.title}
                      </Typography>

                      <Typography sx={{ color: "rgba(255,255,255,.65)", mt: 1 }}>
                        {step.desc}
                      </Typography>

                      <Box
                        sx={{
                          mt: 2,
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={step.img}
                          alt={step.title}
                          style={{
                            width: "100%",
                            height: 160,
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Grid>

                {/* RIGHT SIDE */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: isLeft ? "flex-start" : "flex-end",
                    pl: isLeft ? 6 : 0,
                    pr: isLeft ? 0 : 6,
                  }}
                >
                  {!isLeft && (
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 380,
                        borderRadius: 5,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,.08)",
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
                        backdropFilter: "blur(20px)",
                        p: 3,
                      }}
                    >
                      <Typography sx={{ color: "#ff4d6d", fontWeight: 700 }}>
                        STEP {step.number}
                      </Typography>

                      <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 1 }}>
                        {step.title}
                      </Typography>

                      <Typography sx={{ color: "rgba(255,255,255,.65)", mt: 1 }}>
                        {step.desc}
                      </Typography>

                      <Box
                        sx={{
                          mt: 2,
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={step.img}
                          alt={step.title}
                          style={{
                            width: "100%",
                            height: 160,
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}