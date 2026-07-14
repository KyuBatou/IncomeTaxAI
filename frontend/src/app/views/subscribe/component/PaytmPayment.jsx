import React, { useState } from 'react';
import { Box, Button } from "@mui/material";
import { postCreatePaytmTransaction, postVerifyPaytmPayment } from "../services/apiService";

const PaytmPayment = ({
  userDetails,
  selectedPlans,
  amount,
  selectedSalesman,
  taxAmount,
  totalAmount,
  orderNumber,
  setPaymentStatus,
  setpaymentId,
  handleNextStep,
  handleBackStep
}) => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  console.log(error);
  console.log(orderId);

  const verifyPayment = async (data) => {
    try {
      const verifyResponse = await postVerifyPaytmPayment(data);
      if (verifyResponse.success) {
        setPaymentStatus('success');
        setpaymentId(data.TXNID || '');
        handleNextStep();
      } else {
        setPaymentStatus('failed');
        setError('Payment verification failed.');
        handleNextStep();
      }
    } catch (verifyError) {
      setPaymentStatus('failed');
      setError('Payment verification failed.');
      handleNextStep();
    }
    window.Paytm.CheckoutJS.close();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setOrderId(orderNumber);
      const orderDetails = {userDetails, selectedPlans, amount, selectedSalesman, taxAmount, totalAmount, orderNumber};
      const response = await postCreatePaytmTransaction(orderDetails);
      console.log(response)
      const { txnToken } = response.body;
      if (!txnToken) throw new Error('Transaction token not received from Paytm');
      const paytmConfig = {
        root: '',
        flow: 'DEFAULT',
        iframe: false,
        data: {
          orderId: orderNumber,
          token: txnToken,
          tokenType: 'TXN_TOKEN',
          amount: totalAmount.toString(),
        },
        merchant:{
          redirect: false
        },
        handler: {
          notifyMerchant: function (eventName, data) {
            console.log('Event:', eventName, 'Data:', data);
            verifyPayment(data);
            setLoading(false);
          },
          transactionStatus:function(data){
            verifyPayment(data);
            setLoading(false);
          }
        }
      };

      if (window.Paytm && window.Paytm.CheckoutJS) {
        window.Paytm.CheckoutJS.init(paytmConfig)
          .then(() => {
            window.Paytm.CheckoutJS.invoke();
          })
          .catch(error => {
            console.error("Paytm Checkout Error:", error);
            setError('Payment initialization failed: ' + (error.message || ''));
            setPaymentStatus('failed');
            setLoading(false);
          });
      } else {
        setError('Paytm payment service is not available. Please refresh the page.');
        setPaymentStatus('failed');
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError(err.message || "Failed to initiate payment");
      setPaymentStatus('failed');
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

export default PaytmPayment;