import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Hero() {
  const words = ["GST", "Income Tax", "Legal Drafting", "Case Laws"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const speed = 120;

  // TYPEWRITER EFFECT
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1200);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting]);

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: 14,
        color: "#fff",
        textAlign: "center",

      }}
    >
      {/* glow overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 60%)",
        }}
      />

      <Container sx={{ position: "relative", zIndex: 2 }}>
        {/* TITLE */}
        <Typography
          sx={{
            fontSize: { xs: 34, md: 50 },
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          AI-Powered Legal Intelligence
          <br />
          Delivering Instant, Accurate Answers for
          <br />

          {/* TYPING TEXT */}
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: "#ff4d6d",
              fontWeight: 900,
            }}
          >
            {words[index].substring(0, subIndex)}

            {/* CURSOR */}
            <Box
              component="span"
              sx={{
                width: "3px",
                height: "40px",
                backgroundColor: "#ff4d6d",
                display: "inline-block",
                ml: 0.5,
                animation: "blink 0.8s infinite",
              }}
            />
          </Box>
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            mt: 4,
            opacity: 0.75,
            maxWidth: 850,
            mx: "auto",
            fontSize: 16,
            lineHeight: 1.8,
          }}
        >
          ITL AI is an advanced legal research assistant for Chartered Accountants,
          Advocates, and tax professionals. It delivers instant law-backed answers,
          smart drafting, case law insights, and compliance assistance powered by AI.
        </Typography>

        {/* CTA BUTTON */}
        <Button
          onClick={() => window.location.href = "/session/signin"}
          sx={{
            mt: 6,
            px: 7,
            py: 1.6,
            borderRadius: 50,
            fontWeight: 800,
            fontSize: 15,
            color: "#fff",

            background:
              "linear-gradient(90deg,#ff2d55,#ff4d6d,#ff6b81)",

            boxShadow: "0 0 30px rgba(255,77,109,0.4)",

            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 0 50px rgba(255,77,109,0.6)",
            },
          }}
        >
          Start AI Assistant
        </Button>
      </Container>

      {/* CURSOR BLINK ANIMATION */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}