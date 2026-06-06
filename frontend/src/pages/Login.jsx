import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../services/authService";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FeedIcon from "@mui/icons-material/Feed";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginApi(formData);
      login(data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left: Branded Panel ── */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <PeopleAltIcon sx={{ color: "#fff", fontSize: 40 }} />
          </div>
          <h1>Social Feed</h1>
          <p>Connect with friends, share your moments, and discover what's happening around the world.</p>

        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="auth-right">
        <div className="auth-form-container animate-fadeInUp">
          <h2 className="auth-form-title">Welcome back!</h2>
          <p className="auth-form-subtitle">Sign in to your account to continue</p>

          <form className="auth-form" onSubmit={handleSubmit} id="login-form">
            {error && (
              <div className="auth-error">
                <ErrorOutlinedIcon sx={{ fontSize: 18 }} />
                {error}
              </div>
            )}

            <div>
              <label className="auth-field-label" htmlFor="login-email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <EmailIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                </span>
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="auth-field-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <LockIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                </span>
                <input
                  id="login-password"
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/signup">Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
