import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Hero({ data }) {
  const words = [data?.word_one, data?.word_two].filter(Boolean);

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const speed = 120;

  // reset when words change
  useEffect(() => {
    setIndex(0);
    setSubIndex(0);
    setDeleting(false);
  }, [data]);

  // TYPEWRITER EFFECT
  useEffect(() => {
    if (!words.length) return;
  
    let timeout;
  
    const type = () => {
      const currentWord = words[index];
  
      if (!deleting) {
        // typing
        if (subIndex < currentWord.length) {
          setSubIndex((prev) => prev + 1);
          timeout = setTimeout(type, speed);
        } else {
          timeout = setTimeout(() => setDeleting(true), 1000);
        }
      } else {
        // deleting
        if (subIndex > 0) {
          setSubIndex((prev) => prev - 1);
          timeout = setTimeout(type, speed / 2);
        } else {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
          timeout = setTimeout(type, 300);
        }
      }
    };
  
    timeout = setTimeout(type, speed);
  
    return () => clearTimeout(timeout);
  }, [index, subIndex, deleting, words]);

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
            fontSize: { xs: 34, md: 60 },
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          {data?.title_prefix} <br></br>
          {/* TYPING TEXT */}
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: "#ff4d6d",
              fontWeight: 900,
              minHeight: 60,
            }}
          >
            {words[index]?.substring(0, subIndex)}

            <Box
              component="span"
              sx={{
                width: "3px",
                height: "40px",
                backgroundColor: "#ff4d6d",
                display: "inline-block",
                ml: 1.0,
                animation: "blink 2s infinite",
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
          {data?.description}
        </Typography>

        {/* CTA BUTTON */}
        {data?.button_one_text && (
          <Button
            onClick={() =>
              (window.location.href = data?.button_one_link || "/")
            }
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
            {data?.button_one_text}
          </Button>
        )}
      </Container>

      {/* CURSOR ANIMATION */}
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