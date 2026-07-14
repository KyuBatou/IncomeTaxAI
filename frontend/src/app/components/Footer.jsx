import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { ThemeProvider, styled, useTheme } from "@mui/material/styles";

import { Span } from "./Typography";
import useSettings from "app/hooks/useSettings";
import { topBarHeight } from "app/utils/constant";
import { Typography } from "@mui/material";

// STYLED COMPONENTS
const AppFooter = styled(Toolbar)(() => ({
  display: "flex",
  alignItems: "center",
  minHeight: topBarHeight,
  "@media (max-width: 499px)": {
    display: "table",
    width: "100%",
    minHeight: "auto",
    padding: "1rem 0",
    "& .container": {
      flexDirection: "column !important",
      "& a": { margin: "0 0 16px !important" }
    }
  }
}));

const FooterContent = styled("div")(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "0px 1rem",
  maxWidth: "1170px",
  margin: "0 auto"
}));

export default function Footer() {
  const theme = useTheme();
  const { settings } = useSettings();

  const footerTheme = settings.themes[settings.footer.theme] || theme;

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar color="primary" position="static" sx={{ zIndex: 96 }}>
        <AppFooter>
          <FooterContent>
            {/* <a href="https://ui-lib.com/downloads/matx-pro-react-admin/">
              <Button variant="contained" color="secondary">
                Get ITL AI Pro
              </Button>
            </a> */}

            <Span m="auto" />

            {/* <Paragraph m={0}>
              ITL AI - Designed, Developed and Delivered by <a href="https://incometaxlibrary.com/" style={{textDecoration: 'underline'}}>Income Tax Library</a>
            </Paragraph> */}
            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                color: "rgba(255,255,255,.45)",
                fontSize: 14,
              }}
            >
              ITL AI - Designed, Developed and Delivered by{" "}
              <a
                href="https://incometaxlibrary.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#ff4d6d",
                  textDecoration: "underline",
                }}
              >
                Income Tax Library
              </a>
            </Typography>

          </FooterContent>
        </AppFooter>
      </AppBar>
    </ThemeProvider>
  );
}
