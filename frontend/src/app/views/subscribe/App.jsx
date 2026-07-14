import React, { useState, useEffect } from "react";
import { Box, Divider, Typography, Stepper, Step, StepLabel, Container } from "@mui/material";
import { Breadcrumb, MatxLoading, SimpleCard } from "app/components";
import PaymentResponse from "./PaymentResponse";
import UserDetailsStep from "./UserDetailsStep";
import SelectPlanStep from "./SelectPlanStep";
import InvoiceStep from "./InvoiceStep";
import { fetchSalesmans, fetchSubscriptionPlans, postDiscountCoupon } from "./services/apiService";

export default function SubscriptionPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [plans, setPlans] = useState([]);
  const steps = ["Enter User Details", "Select a Subscription Plan", "Review & Pay", "Receipt"];

  // const plans = [
  //   { id: 1, year: "One Year Subscription", price: 9000 },
  //   { id: 2, year: "Three Years Subscription", price: 23400 },
  //   { id: 3, year: "Five Years Subscription", price: 36000 },
  //   { id: 4, year: "Ten Years Subscription", price: 66600 },
  //   { id: 5, year: "Founder Membership Scheme Fee", price: 18000 },
  // ];

  const [userData, setUserData] = useState(null);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [amount, setAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setfinalAmount] = useState(0);
  const [appliedCoupon, setappliedCoupon] = useState(false);
  const [coupon, setcoupon] = useState('');
  const [error, seterror] = useState('');
  const [salesman, setSalesman] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentId, setpaymentId] = useState("");

  // useEffect(() => {
  //   const fetchContent = async () => {
  //     try {
  //       const data = await fetchSalesmans();
  //       setSalesman(data);
  //     } catch (error) {
  //       console.error("Error fetching salesmen:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchContent();
  // }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [salesmanData, planData] = await Promise.all([
          fetchSalesmans(),
          fetchSubscriptionPlans()
        ]);
        setSalesman(salesmanData);
        setPlans(planData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const calculateAmounts = (updatedPlans) => {
    const hasPlan1 = updatedPlans.includes(1);
    const hasPlan5 = updatedPlans.includes(5);  
    const isFounder = userData?.isFounderMember;
    const baseAmount = updatedPlans.reduce((sum, planId) => {
      const plan = plans.find((p) => p.id === planId);
      if (!plan) return sum;
      let planPrice = plan.price;
      if (planId === 1 && hasPlan1 && hasPlan5) {
        planPrice = plan.price / 2;
      }
      if (planId === 1 && isFounder && !hasPlan5) {
        planPrice = plan.price / 2;
      }
      return sum + planPrice;
    }, 0);  
    const tax = baseAmount * 0.18;
    setAmount(baseAmount);
    setTaxAmount(tax);
    setfinalAmount(baseAmount + tax);

  };

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    const tax = newAmount * 0.18;
    const totalAmount = appliedCoupon
      ? (newAmount + tax) * 0.9
      : newAmount + tax;
    setAmount(newAmount);
    setTaxAmount(tax);
    setfinalAmount(totalAmount);
    setappliedCoupon(false);
    handleCouponApply();
  };

  const handlePlanSelection = (planId) => {
    const updatedPlans =
      planId === 5
        ? selectedPlans.includes(5)
          ? [1]
          : [1, 5]
        : planId === 1
        ? selectedPlans.includes(1) && selectedPlans.includes(5)
          ? [5]
          : selectedPlans.includes(1)
          ? []
          : [1]
        : [planId];
    setSelectedPlans(updatedPlans);
    calculateAmounts(updatedPlans);
  };

  const handleCouponApply = async () => {
    if (appliedCoupon) {
      setcoupon('');
      setappliedCoupon(false);
      setDiscountAmount(0);
      setfinalAmount(amount + taxAmount);
      seterror("");
    } else if (coupon) {
      try {
        const payload = { "coupon": coupon, "amount": amount };
        const data = await postDiscountCoupon(payload);
        if (data.valid) {
          const discount = amount * (data.discount / 100);
          const newAmount = amount - discount;
          const newTaxAmount = newAmount * 0.18;
  
          setappliedCoupon(true);
          setDiscountAmount(discount);
          setAmount(newAmount);
          setTaxAmount(newTaxAmount);
          setfinalAmount(newAmount + newTaxAmount);
          seterror("");
        } else {
          seterror("Invalid coupon code");
        }
      } catch (error) {
        seterror("Error applying coupon. Please try again.");
      }
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb routeSegments={[{ name: "Dashboard", path: "/dashboard" }, { name: "Subscription" }]} />
      </Box>

      <SimpleCard title="Subscribe Now">
        <Divider sx={{ bgcolor: "secondary.dark", mb: 2 }} />
        {/* <OutlinedBox sx={{ padding: 3 }}> */}
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "#1a73e8", mb: 3 }}>
            Subscribe Now
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={4}>
            {activeStep === 0 && (
              <UserDetailsStep
                setUserData={setUserData}
                userData={userData}
                handleNextStep={handleNext}
              />
            )}
            {activeStep === 1 && (
              <>
              {loading ? (
                <MatxLoading />
              ) : (
                <SelectPlanStep
                  subscriptionPlans={plans}
                  userData={userData}
                  salesman = {salesman}
                  selectedSalesman = {selectedSalesman}
                  setSelectedSalesman = {setSelectedSalesman}
                  finalAmount = {finalAmount.toFixed(2)}
                  amount = {amount}
                  taxAmount = {taxAmount.toFixed(2)}
                  selectedPlans = {selectedPlans}
                  coupon = {coupon}
                  appliedCoupon = {appliedCoupon}
                  error = {error}
                  setcoupon={setcoupon}
                  handleAmountChange={handleAmountChange}
                  handlePlanSelection={handlePlanSelection}
                  handleCouponApply={handleCouponApply}
                  calculateAmounts={calculateAmounts}
                  handleNextStep={handleNext}
                  handleBackStep={handleBack}
                />
              )}
              </>
            )}
            {activeStep === 2 && (
              <InvoiceStep
                userDetails={userData}
                plans={plans}
                selectedPlans={selectedPlans}
                amount={amount}
                selectedSalesman = {selectedSalesman}
                discountAmount={discountAmount}
                taxAmount={taxAmount}
                setPaymentStatus={setPaymentStatus}
                setpaymentId={setpaymentId}
                handleNextStep={handleNext}
                handleBackStep={handleBack}
              />
            )}
            {activeStep === 3 && (
              <PaymentResponse
                userDetails={userData}
                plans={plans}
                selectedPlans={selectedPlans}
                amount={amount}
                selectedSalesman = {selectedSalesman}
                discountAmount={discountAmount}
                taxAmount={taxAmount}
                paymentStatus={paymentStatus}
                paymentId={paymentId}
                handleAmountChange={handleAmountChange}
                handleBackStep={handleBack}
              />
            )}
          </Box>
        {/* </OutlinedBox> */}
      </SimpleCard>
    </Container>
  );
}