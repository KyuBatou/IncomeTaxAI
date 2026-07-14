import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex"
}));


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
  background:
    "linear-gradient(160deg,#8B0016,#4a0010)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
}));

const RightPanel = styled(Box)(() => ({
  padding: 45,
  width: "100%"
}));

// initial login credentials
const initialValues = {
  email: "bhaawani.singh@gmail.com",
  password: "Bhawani@6127",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email address")
    .required("Email is required!"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required!")
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/gst", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleFormSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate("/gst", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container width="100%">
        <Grid size={{ sm: 6, xs: 12 }}>
          <LeftPanel>
            <h1 style={{display: "block", margin: "0 auto", borderRadius: "30%",}}> Welcome Back!</h1>
            <img
              src="/assets/images/logo-circle.png"
              width="220"
              alt="login"
              style={{display: "block", margin: "0 auto", borderRadius: "30%",}}
            />
            <p>An Intelligent Legal Research Assistant for Income Tax & GST</p>
          </LeftPanel>
          </Grid>

          <Grid size={{ sm: 6, xs: 12 }}>
            <RightPanel>
              <h2>Sign In</h2>
              <Paragraph mb={2}>Enter your details to continue</Paragraph>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      type={showPassword?"text":"password"}
                      name="password"
                      label="Password"
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{
                        endAdornment:
                        <InputAdornment position="end">
                        <IconButton
                          onClick={()=>setShowPassword(!showPassword)}
                        >
                          {
                          showPassword?
                          <VisibilityOff/>
                          :
                          <Visibility/>
                          }
                        </IconButton>
                        </InputAdornment>
                      }}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1} alignItems="center">
                        <Checkbox
                          size="small"
                          name="remember"
                          checked={values.remember}
                          onChange={handleChange}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      fullWidth
                      type="submit"
                      loading={isSubmitting}
                      variant="contained"
                      color="primary"
                      sx={{
                        mt:3,
                        py:1.2,
                        borderRadius:3,
                        textTransform:"none",
                        fontSize:16
                      }}
                    >
                      Login
                    </LoadingButton>

                    <Paragraph sx={{mt:3}}>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{
                          color: theme.palette.primary.main,
                          marginLeft: 5
                        }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </RightPanel>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}