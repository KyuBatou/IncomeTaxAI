import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "@mui/material/styles/styled";

import { Paragraph } from "app/components/Typography";
import { forgotPassword } from "./service/service";

const StyledRoot = styled("div")(() => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg,#8B0016 0%,#c2185b 50%,#ff8a65 100%)",
  ".card": {
    width: 950,
    minHeight: 550,
    display: "flex",
    overflow: "hidden",
    borderRadius: 25,
    boxShadow: "0 20px 60px rgba(0,0,0,.25)"
  }
}));

const LeftPanel = styled(Box)(() => ({
  height: "100%",
  padding: 40,
  color: "#fff",
  background: "linear-gradient(160deg,#8B0016,#4a0010)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center"
}));

const RightPanel = styled(Box)(() => ({
  padding: 45,
  width: "100%"
}));

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container width="100%">
          <Grid size={{ sm: 6, xs: 12 }}>
            <LeftPanel>
              <h1>Forgot Password?</h1>
              <img
                src="/assets/images/logo-circle.png"
                width="220"
                alt="logo"
                style={{
                  display: "block",
                  margin: "20px auto",
                  borderRadius: "30%"
                }}
              />
              <p>
                Reset your password and continue using
                <br />
                Intelligent Legal Research Assistant
                <br />
                for Income Tax & GST
              </p>
            </LeftPanel>
          </Grid>

          <Grid size={{ sm: 6, xs: 12 }}>
            <RightPanel>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  textTransform: "none"
                }}
              >
                ← Back to Home
              </Button>

              <h2>Reset Password</h2>

              <Paragraph mb={3}>
                Enter your registered email address. We will send your password details.
              </Paragraph>

              <form onSubmit={handleFormSubmit}>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  label="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.2,
                    borderRadius: 3,
                    textTransform: "none",
                    fontSize: 16
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                {message && (
                  <Paragraph
                    sx={{
                      mt: 2,
                      color: "green"
                    }}
                  >
                    {message}
                  </Paragraph>
                )}

                {error && (
                  <Paragraph
                    sx={{
                      mt: 2,
                      color: "red"
                    }}
                  >
                    {error}
                  </Paragraph>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/session/signin")}
                  sx={{
                    mt: 2,
                    py: 1.2,
                    borderRadius: 3,
                    textTransform: "none"
                  }}
                >
                  Back to Login
                </Button>
              </form>
            </RightPanel>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}