import React, { useState } from "react";
import { Box, Typography, Divider, Grid, Radio, RadioGroup, FormControlLabel, FormControl, } from "@mui/material";
import RazorpayPayment from "./component/RazorpayPayment";
import PaytmPayment from "./component/PaytmPayment";

const InvoiceStep = ({
  userDetails = {},
  plans = [],
  selectedPlans = [],
  discountAmount = 0,
  selectedSalesman = '',
  amount = 0,
  taxAmount = 0,
  setPaymentStatus,
  setpaymentId,
  handleNextStep,
  handleBackStep,
}) => {
  const totalAmount = amount + taxAmount;
  const orderNumber = Math.floor(10000000000 + Math.random() * 99999999999);
  const [paymentMethod, setPaymentMethod] = useState('paytm'); // Default payment method

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const renderPaymentButton = () => {
    switch (paymentMethod) {
      case 'razorpay':
        return (
          <RazorpayPayment
            userDetails={userDetails}
            selectedPlans={selectedPlans}
            amount={amount}
            taxAmount={taxAmount}
            selectedSalesman={selectedSalesman}
            totalAmount={totalAmount}
            orderNumber={orderNumber}
            setPaymentStatus={setPaymentStatus}
            setpaymentId={setpaymentId}
            handleNextStep={handleNextStep}
            handleBackStep={handleBackStep}
          />
        );
      case 'paytm':
        return (
          <PaytmPayment
            userDetails={userDetails}
            selectedPlans={selectedPlans}
            amount={amount}
            taxAmount={taxAmount}
            selectedSalesman={selectedSalesman}
            totalAmount={totalAmount}
            orderNumber={orderNumber}
            setPaymentStatus={setPaymentStatus}
            setpaymentId={setpaymentId}
            handleNextStep={handleNextStep}
            handleBackStep={handleBackStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        width: 900,
        mx: "auto",
        p: 4,
        backgroundColor: "#fff",
        color: '#000',
        borderRadius: 2,
        boxShadow: 3,
        border: "1px solid #ddd",
      }}
    >
      {/* Page Title */}
      <Typography variant="h4" align="center" fontWeight="bold" mb={3} color="primary">
        Review & Confirm
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
        <SummaryRow label="Total Payable" value={totalAmount} isBold />
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Payment Method Selection */}
      <SectionTitle title="Select Payment Method" />
      <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
        <RadioGroup
          aria-label="payment method"
          name="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel
            value="paytm"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png" 
                  alt="Paytm" 
                  style={{ height: 24, marginRight: 10 }} 
                />
              </Box>
            }
          />
          {/* <FormControlLabel
            value="razorpay"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center">
                <img 
                  src="https://razorpay.com/assets/razorpay-logo.svg"
                  alt="Razorpay" 
                  style={{ height: 24, marginRight: 10 }} 
                />
              </Box>
            }
          /> */}
        </RadioGroup>
      </FormControl>

      {/* Render selected payment button */}
      {renderPaymentButton()}

      <Typography align="center" color="error" mb={3} sx={{ fontStyle: "italic" }}>
        Note: Your GSTIN-compliant invoice will be sent to your email separately.
      </Typography>
    </Box>
  );
};

// Section Title Component
const SectionTitle = ({ title }) => (
  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ borderBottom: "2px solid #1976d2", display: "inline-block", mb: 2 }}>
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

export default InvoiceStep;