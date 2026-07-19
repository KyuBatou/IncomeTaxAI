import { Navigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";

const PaymentGuard = ({ children }) => {
  const { user } = useAuth();

  const hasActivePlan = user?.is_approved;

  if (!hasActivePlan) {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
};

export default PaymentGuard;