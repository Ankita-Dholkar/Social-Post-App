import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show spinner while restoring session from localStorage
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-main)",
        }}
      >
        <CircularProgress sx={{ color: "var(--primary-light)" }} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
