import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupApi } from "../services/authService";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ImageIcon from "@mui/icons-material/Image";
import GroupIcon from "@mui/icons-material/Group";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await signupApi(formData);
      login(data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
          <h1>Join Social Feed</h1>
          <p>Create an account and start sharing your story with a growing community of creators and thinkers.</p>

        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="auth-right">
        <div className="auth-form-container animate-fadeInUp">
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Free forever. No credit card required.</p>

          <form className="auth-form" onSubmit={handleSubmit} id="signup-form">
            {error && (
              <div className="auth-error">
                <ErrorOutlinedIcon sx={{ fontSize: 18 }} />
                {error}
              </div>
            )}

            <div>
              <label className="auth-field-label" htmlFor="signup-username">Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <PersonIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                </span>
                <input
                  id="signup-username"
                  className="auth-input"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="auth-field-label" htmlFor="signup-email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <EmailIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                </span>
                <input
                  id="signup-email"
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
              <label className="auth-field-label" htmlFor="signup-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <LockIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                </span>
                <input
                  id="signup-password"
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center" }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
