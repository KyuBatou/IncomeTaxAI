import React, { useState } from 'react';
import { Button, Box } from "@mui/material";
import { postCreateOrder, postVerifyPayment } from "../services/apiService";

const RazorpayPayment = ({userDetails, selectedPlans, amount, selectedSalesman, taxAmount, totalAmount, orderNumber, setPaymentStatus, setpaymentId, handleNextStep, handleBackStep}) => {

  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Payment gateway failed to load');
        return;
      }
  
      const orderDetails = {userDetails, selectedPlans, amount, selectedSalesman, taxAmount, totalAmount, orderNumber};
      const order = await postCreateOrder(orderDetails);
      setpaymentId(order.id);
      const options = {
        // key: 'rzp_test_pOCIYbOYzrYWUK',
        key: 'rzp_live_KOcogkdLbAxLEu',
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'IncomeTax Library',
        description: 'Payment for your order',
        image: '/static/assets/images/logo.png',
        handler: (response) => {
          try {
            const verifyResponse = postVerifyPayment(response);
            setPaymentStatus(verifyResponse.status);
            handleNextStep();
          } catch (error) {
            console.error('Verification Error:', error);
            setPaymentStatus('failed');
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.mobileNumber,
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        setPaymentStatus('failed');
        alert(`Payment failed: ${response.error.description}`);
      });
      
      rzp.open();
    } catch (error) {
      console.error('Payment Error:', error);
      setPaymentStatus('failed');
      alert('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" gap={2}>
      <Button variant="outlined" color="secondary" onClick={handleBackStep} sx={{ width: 180 }}>
        Go Back
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handlePayment} 
        disabled={loading} 
        sx={{ width: 180 }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </Box>
  );
};

export default RazorpayPayment;

