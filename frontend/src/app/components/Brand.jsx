import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";

import { Span } from "./Typography";
import { MatxLogo } from "app/components";
import useSettings from "app/hooks/useSettings";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

// STYLED COMPONENTS
const BrandRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 18px 20px 29px"
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: ".5rem",
  display: mode === "compact" ? "none" : "block"
}));

export default function Brand({ children }) {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <Link to="/gst">
          <MatxLogo />
          <Typography
            onClick={() => scrollToSection("home")}
            sx={{
              fontWeight: 900,
              fontSize: 20,
              cursor: "pointer",
              letterSpacing: 1,
              ml: 2,

              background:
                "linear-gradient(90deg,#ff4d6d,#ff8fa3,#ffb3c1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",

              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            ITL AI
          </Typography>
        </Link>

      </Box>

      <Box className="sidenavHoverShow" sx={{ display: mode === "compact" ? "none" : "block" }}>
        {children || null}
      </Box>
    </BrandRoot>
  );
}
