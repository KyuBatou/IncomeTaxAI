import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

export default function FAQSection({ data = [] }) {
  return (
    <Box
      id="faq"
      sx={{
        py: 8,
        position: "relative",
      }}
    >
      <Container maxWidth="md">
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
          Frequently Asked Questions
        </Typography>

        <Typography
          textAlign="center"
          sx={{
            color: "rgba(255,255,255,.65)",
            mb: 7,
            fontSize: 18,
          }}
        >
          Everything you need to know about ITL AI.
        </Typography>

        {data?.map((faq, index) => (
          <Accordion
            key={faq.id || index}
            disableGutters
            elevation={0}
            sx={{
              mb: 2.5,
              borderRadius: "20px !important",
              overflow: "hidden",
              background:
                "linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.03))",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "#fff",
              transition: ".35s",

              "&:before": {
                display: "none",
              },

              "&:hover": {
                borderColor: "#ff4d6d",
                boxShadow: "0 15px 40px rgba(255,77,109,.18)",
              },

              "&.Mui-expanded": {
                borderColor: "#ff4d6d",
                background:
                  "linear-gradient(145deg,rgba(255,77,109,.12),rgba(255,255,255,.04))",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreRoundedIcon sx={{ color: "#ff4d6d", fontSize: 30 }} />
              }
              sx={{
                px: 4,
                py: 1.2,
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 2,
                },
              }}
            >
              {/* Number */}
              <Typography
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg,#ff2d55,#ff6b81)",
                  color: "#fff",
                  fontWeight: 700,
                  mr: 2,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 9, pb: 4 }}>
              <Typography
                sx={{
                  textAlign: 'justify',
                  color: "rgba(255,255,255,.72)",
                  lineHeight: 1.9,
                  fontSize: 16,
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}