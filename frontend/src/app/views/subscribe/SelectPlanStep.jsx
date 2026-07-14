import React from "react";
import { Box, Typography, Button, Grid, TextField, Select, MenuItem, Card, CardContent, Checkbox, Alert } from "@mui/material";
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function SubscriptionForm({ 
  subscriptionPlans,
  userData,
  salesman,
  selectedSalesman,
  setSelectedSalesman,
  finalAmount,
  amount,
  taxAmount,
  selectedPlans,
  coupon,
  appliedCoupon,
  error,
  setcoupon,
  handleAmountChange,
  handlePlanSelection,
  handleCouponApply,
  handleNextStep,
  handleBackStep
}) {

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Subscription Offer
      </Typography>

      <Grid container spacing={3}>
        {subscriptionPlans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: selectedPlans.includes(plan.id)
                  ? "0px 0px 8px 2px rgba(25, 118, 210, 0.5)"
                  : "0px 0px 4px rgba(0, 0, 0, 0.2)",
                border: selectedPlans.includes(plan.id) ? "2px solid #1976D2" : "1px solid #ddd",
                cursor: "pointer",
                "&:hover": { boxShadow: "0px 0px 10px 3px rgba(25, 118, 210, 0.6)", transform: "scale(1.02)" },
              }}
              onClick={() => handlePlanSelection(plan.id)}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={selectedPlans.includes(plan.id)}
                    color="primary"
                    onChange={() => handlePlanSelection(plan.id)}
                  />
                  <Box>
                    <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: plan.id === 5 ? "green" : "primary.main" }}>
                      {plan.year}
                    </Typography>
                    <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "error.main", display: "flex", alignItems: "center" }}>
                      {userData.isFounderMember && plan.id === 1 ? (
                        <>
                          <span style={{ textDecoration: "line-through", color: "#999", marginRight: 8 }}>
                            ₹{plan.price.toLocaleString()}
                          </span>
                          ₹{(plan.price / 2).toLocaleString()}
                          <Tooltip title="Founder Member Offer" arrow>
                            <InfoOutlinedIcon fontSize="small" sx={{ color: "green", ml: 1 }} />
                          </Tooltip>
                        </>
                      ) : (
                        <>₹{plan.price.toLocaleString()}</>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12}>
          <Typography variant="body1">Booked By</Typography>
          <Select
            fullWidth
            value={selectedSalesman}
            onChange={(e) => setSelectedSalesman(e.target.value)}
            displayEmpty
          >
            <MenuItem key="" value="">----- Direct -----</MenuItem>
            {salesman.map((man) => (
              <MenuItem key={man.id} value={man.id}>
                {man.name}
              </MenuItem>
            ))}
          </Select>
          </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Amount</Typography>
          <TextField
            value={amount}
            onChange={handleAmountChange}
            disabled={selectedSalesman === ""}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Tax Amount (18%)</Typography>
          <TextField value={taxAmount} disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Coupon</Typography>
          <TextField
            value={coupon}
            onChange={(e) => setcoupon(e.target.value)} // Update coupon value on change
            disabled={appliedCoupon} // Disable if the coupon is already applied
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleCouponApply}
            sx={{ mt: 2 }}
          >
            {appliedCoupon ? "Change Coupon" : "Apply Coupon"}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Final Amount</Typography>
          <TextField value={finalAmount} disabled fullWidth />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" color="secondary" size="large" onClick={handleBackStep}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNextStep} disabled={!finalAmount}>
          Next
        </Button>
      </Box>
    </Box>
  );
}