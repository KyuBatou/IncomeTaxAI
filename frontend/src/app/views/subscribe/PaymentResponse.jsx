import React, { useRef } from "react";
import { Box, Typography, Divider, Grid, Button } from "@mui/material";

const PaymentResponse = ({
  userDetails = {},
  plans = [],
  selectedPlans = [],
  discountAmount = 0,
  selectedSalesman = '',
  amount = 0,
  taxAmount = 0,
  paymentStatus = '',
  paymentId = '',
  handleBackStep,
}) => {
  const totalAmount = amount + taxAmount ;
  const orderNumber = Math.floor(10000000000 + Math.random() * 99999999999);
  const printRef = useRef();
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  return (
    <>
    <Box
      ref={printRef}
      sx={{
        maxWidth: "100%",
        width: 900,
        mx: "auto",
        p: 4,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
        border: "1px solid #ddd",
        mt: 2,
      }}
    >
      <Typography variant="h4" align="center" fontWeight="bold" mb={3} color="primary">
        Receipt
      </Typography>

      {/* Billing Information */}
      <SectionTitle title="Billing Information" />
      <Grid container spacing={2}>
        {[
          { label: "Name", value: userDetails.name },
          { label: "Company", value: userDetails.companyName },
          { label: "Email", value: userDetails.email },
          { label: "Phone", value: userDetails.mobileNumber },
          { label: "Legal Name", value: userDetails.legalName },
          { label: "GSTIN", value: userDetails.gstin },
          { label: "Billing Address", value: `${userDetails.name || ""} ${userDetails.address || "N/A"}` },
        ].map((item, idx) => (
          <Grid item xs={6} key={idx}>
            <Typography>{item.label}: {item.value || "N/A"}</Typography>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Order Details */}
      <SectionTitle title="Order Details" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Order Number:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography align="right">{orderNumber}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Order Date:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography align="right">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Payment Summary */}
      <SectionTitle title="Payment Summary" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Product:</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Typography>
            {selectedPlans.length
              ? selectedPlans.map((id) => plans.find((p) => p.id === id)?.year).join(" with ")
              : "N/A"}
          </Typography>
        </Grid>
        <SummaryRow label="Amount" value={amount} />
        <SummaryRow label="GST (18%)" value={taxAmount} />
        {/* <SummaryRow label="Coupon Discount" value={-discountAmount} isBold /> */}
        <SummaryRow label="Total Payable" value={totalAmount} isBold />
      </Grid>

      <Typography align="left" mt={3} >
        We thank you for being a subscriber of Income Tax Library (www.incometaxlibrary.com).
      </Typography>
      <Typography align="left" mt={3} >
        Your Payment Transaction ID: {paymentId}.
      </Typography>
      <Typography align="left" mt={3} >
        Your login will be activated shortly.
      </Typography>
      <Typography align="left" color="error" mt={3} >
        Note: If any error occurs, please contact us on +91-9001597011, +91-9982608890 or email us: info@incometaxlibrary.com.
      </Typography>
    </Box>
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Button variant="contained" color="primary" onClick={handlePrint}>
        Print Receipt
      </Button>
    </Box>
    </>
  );
};

// Section Title Component
const SectionTitle = ({ title }) => (
  <Typography
    variant="h6"
    fontWeight="bold"
    gutterBottom
    sx={{ borderBottom: "2px solid #1976d2", display: "inline-block", mb: 2 }}
  >
    {title}
  </Typography>
);

// Summary Row Component
const SummaryRow = ({ label, value, isBold }) => (
  <>
    <Grid item xs={6}>
      <Typography fontWeight={isBold ? "bold" : "normal"}>{label}:</Typography>
    </Grid>
    <Grid item xs={6} align="right">
      <Typography fontWeight={isBold ? "bold" : "normal"}>₹{value.toFixed(2)}</Typography>
    </Grid>
  </>
);

export default PaymentResponse;