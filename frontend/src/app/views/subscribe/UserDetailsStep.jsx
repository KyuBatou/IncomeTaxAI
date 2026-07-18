import React, { useState, useEffect, useCallback } from "react";
import { Box, TextField, Button, CircularProgress, Alert, Typography, Grid } from "@mui/material";
import fetchUserDetail from "./services/apiService";
import { useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";

export default function UserDetailsStep({ setUserData, userData, handleNextStep }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const { user } = useAuth();

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsFetched(false);
  
    try {
      if (email){
      const data = await fetchUserDetail(email);
      if (data.error === "Request failed with status code 404") {
        throw new Error("User not found. Please check the email.");
      }
      setUserData({
        name: data.name || "",
        email: data.email || "",
        mobileNumber: data.mobileNumber || "",
        companyName: data.companyName || "",
        address: data.address || "",
        legalName: data.legalName || "",
        gstin: data.gstin || "",
        isFounderMember: data.isFounderMember || false,
      });
      setIsFetched(true);
      }
    } catch (err) {
      setError(err.message);
      navigate("/session/signin");
    } finally {
      setLoading(false);
    }
  }, [email, setUserData, navigate]);

  useEffect(() => {
    if (user?.email && !isFetched) {
      setEmail(user?.email);
      fetchUserDetails();
    }
  }, [user?.email, isFetched, fetchUserDetails]);

  const handleCancel = () => {
    setEmail("");
    setUserData(null);
    setIsFetched(false);
    setError("");
  };

  const renderField = (label, value, key, multiline = false) => (
    <Grid item xs={12} sm={6} key={key}>
      <TextField
        label={label}
        value={value}
        fullWidth
        multiline={multiline}
        variant="outlined"
        color="primary"
        onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
      />
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 700, margin: "0 auto", padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 2, backgroundColor: "white" }}>
      <Typography variant="h5" align="center" gutterBottom color="primary">
        Enter Your Email
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{ readOnly: isFetched }}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={fetchUserDetails}
            disabled={loading || !email || isFetched}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch Details"}
          </Button>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>

      {userData && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom color="primary">
            User Details
          </Typography>
          <Grid container spacing={2}>
            {renderField("Name", userData.name, "name")}
            {renderField("Mobile Number", userData.mobileNumber, "mobileNumber")}
            {renderField("Company Name", userData.companyName, "companyName")}
            {renderField("Address", userData.address, "address", true)}
            {renderField("Legal Name", userData.legalName, "legalName")}
            {renderField("GSTIN", userData.gstin, "gstin")}
          </Grid>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" size="large" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleNextStep}
              disabled={!isFetched}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}