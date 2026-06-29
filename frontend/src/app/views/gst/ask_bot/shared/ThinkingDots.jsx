import { Box } from "@mui/material";

export const ThinkingDots = () => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
      }}
    >
        AI Thinking
      <Box sx={dotStyle(0)} />
      <Box sx={dotStyle(0.2)} />
      <Box sx={dotStyle(0.4)} />
    </Box>
  );
};

const dotStyle = (delay) => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  bgcolor: "text.secondary",
  animation: "bounce 1.2s infinite ease-in-out",
  animationDelay: `${delay}s`,
  "@keyframes bounce": {
    "0%, 80%, 100%": {
      transform: "scale(0)",
      opacity: 0.3,
    },
    "40%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
});