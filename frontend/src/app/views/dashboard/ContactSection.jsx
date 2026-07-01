import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  
  import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
  import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
  import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
  import SendRoundedIcon from "@mui/icons-material/SendRounded";
  
  export default function ContactSection() {
    const textFieldStyle = {
      "& .MuiOutlinedInput-root": {
        color: "#fff",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
  
        "& fieldset": {
          borderColor: "rgba(255,255,255,.18)",
        },
  
        "&:hover fieldset": {
          borderColor: "#fff",
        },
  
        "&.Mui-focused fieldset": {
          borderColor: "#fff",
          borderWidth: "2px",
        },
  
        "& input": {
          color: "#fff",
        },
  
        "& textarea": {
          color: "#fff",
        },
  
        "& input::placeholder": {
          color: "rgba(255,255,255,.5)",
          opacity: 1,
        },
  
        "& textarea::placeholder": {
          color: "rgba(255,255,255,.5)",
          opacity: 1,
        },
  
        // Chrome Autofill
        "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 100px transparent inset",
          WebkitTextFillColor: "#fff",
          transition: "background-color 9999s ease-out 0s",
        },
      },
  
      "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,.75)",
      },
  
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#fff",
      },
    };
  
    return (
      <Box
        id="contact"
        sx={{
          py: 8,
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          {/* Heading */}
          <Typography
            textAlign="center"
            sx={{
              fontSize: { xs: 36, md: 50 },
              fontWeight: 800,
              mb: 2,
              background:
                "linear-gradient(90deg,#fff,#ff8fa3,#ff4d6d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Let's Talk
          </Typography>
  
          <Typography
            textAlign="center"
            sx={{
              color: "rgba(255,255,255,.65)",
              mb: 8,
              maxWidth: 650,
              mx: "auto",
              fontSize: 18,
            }}
          >
            Have questions about ITL AI? Our team is here to help you choose
            the right solution for your legal and tax practice.
          </Typography>
  
          <Grid container spacing={5}>
            {/* Left Side */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                {[
                  {
                    icon: <EmailRoundedIcon />,
                    title: "Email",
                    value: "support@itl.ai",
                  },
                  {
                    icon: <PhoneRoundedIcon />,
                    title: "Phone",
                    value: "+91 98765 43210",
                  },
                  {
                    icon: <LocationOnRoundedIcon />,
                    title: "Office",
                    value: "Jaipur Rajasthan, India",
                  },
                ].map((item) => (
                  <Card
                    key={item.title}
                    sx={{
                      borderRadius: 5,
                      color: "#fff",
                      background:
                        "linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.03))",
                      backdropFilter: "blur(25px)",
                      border: "1px solid rgba(255,255,255,.08)",
                      transition: ".35s",
  
                      "&:hover": {
                        transform: "translateY(-6px)",
                        borderColor: "#ff4d6d",
                        boxShadow:
                          "0 15px 35px rgba(255,77,109,.2)",
                      },
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={3}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(135deg,#ff2d55,#ff6b81)",
                            color: "#fff",
                          }}
                        >
                          {item.icon}
                        </Box>
  
                        <Box>
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,.6)",
                            }}
                          >
                            {item.title}
                          </Typography>
  
                          <Typography
                            sx={{
                              mt: 1,
                              fontWeight: 700,
                              fontSize: 18,
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
  
            {/* Right Side */}
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  borderRadius: 6,
                  background:
                    "linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.03))",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,.08)",
                  color: "#fff",
                }}
              >
                <CardContent sx={{ p: 5 }}>
                  <Typography
                    sx={{
                      fontSize: 28,
                      fontWeight: 700,
                      mb: 4,
                    }}
                  >
                    Send us a Message
                  </Typography>
  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        placeholder="John Doe"
                        sx={textFieldStyle}
                      />
                    </Grid>
  
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        placeholder="john@example.com"
                        sx={textFieldStyle}
                      />
                    </Grid>
  
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        placeholder="+91 9876543210"
                        sx={textFieldStyle}
                      />
                    </Grid>
  
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        placeholder="Subject"
                        sx={textFieldStyle}
                      />
                    </Grid>
  
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Message"
                        placeholder="Tell us about your requirements..."
                        sx={textFieldStyle}
                      />
                    </Grid>
  
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        size="large"
                        endIcon={<SendRoundedIcon />}
                        sx={{
                          py: 1.8,
                          borderRadius: 4,
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#fff",
                          background:
                            "linear-gradient(90deg,#ff2d55,#ff4d6d,#ff6b81)",
  
                          "&:hover": {
                            background:
                              "linear-gradient(90deg,#ff1e4d,#ff4065,#ff6b81)",
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }