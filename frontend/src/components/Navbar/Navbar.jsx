import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import "./Navbar.css";

const Navbar = ({ searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name = "") =>
    name.slice(0, 2).toUpperCase();

  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="navbar-logo">
            <PeopleAltIcon sx={{ color: "#fff", fontSize: 20 }} />
          </div>
          <span className="navbar-title">
            Social<span>Feed</span>
          </span>
        </div>

        {/* Search */}
        <div className="navbar-search">
          <span className="navbar-search-icon">
            <SearchIcon sx={{ fontSize: 19 }} />
          </span>
          <input
            id="navbar-search-input"
            type="text"
            className="navbar-search-input"
            placeholder="Search posts and users..."
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>

        {/* Right side */}
        <div className="navbar-right">
          <button className="navbar-icon-btn" title="Notifications" id="navbar-notif-btn">
            <NotificationsNoneIcon sx={{ fontSize: 21 }} />
          </button>

          {/* Profile Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              id="navbar-profile-btn"
              className="navbar-profile-btn"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <div className="navbar-avatar">{getInitials(user?.username)}</div>
              <span className="navbar-username">{user?.username}</span>
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 18,
                  color: "var(--text-muted)",
                  transform: menuOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 150 }}
                  onClick={() => setMenuOpen(false)}
                />
                <div className="navbar-dropdown" id="navbar-dropdown-menu">
                  <div className="navbar-dropdown-header">
                    <span className="navbar-dropdown-name">{user?.username}</span>
                    <span className="navbar-dropdown-email">{user?.email}</span>
                  </div>
                  <button
                    id="navbar-logout-btn"
                    className="navbar-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <LogoutIcon sx={{ fontSize: 18 }} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
