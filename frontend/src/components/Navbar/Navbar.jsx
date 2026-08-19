import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/User";
import "./Navbar.css";

const Navbar = () => {
    const { isloggedin, Logout } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        const success = await Logout();
        if (success) {
            navigate("/login");
        }
    };

    return (
        <nav className="user-navbar">
            <Link to="/" className="user-nav-brand">
                <span className="user-brand-icon">💬</span>
                <span className="user-brand-title">Chatify</span>
            </Link>

            <div className="user-nav-links">
                {isloggedin ? (
                    <>
                        <Link
                            to="/allusers"
                            className={`user-nav-btn ${location.pathname === "/allusers" ? "active" : ""}`}
                        >
                            🌐 Other User
                        </Link>
                        <Link
                            to="/friends"
                            className={`user-nav-btn ${location.pathname === "/friends" || location.pathname === "/getfriends" || location.pathname === "/get_friends" ? "active" : ""}`}
                        >
                            👥 Friends
                        </Link>
                        <Link
                            to="/profile"
                            className={`user-nav-btn ${location.pathname === "/profile" ? "active" : ""}`}
                        >
                            👤 Profile
                        </Link>
                        <button onClick={handleLogout} className="user-nav-btn logout-btn">
                            🚪 Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className={`user-nav-btn primary ${location.pathname === "/login" ? "active" : ""}`}
                        >
                            🔑 Login
                        </Link>
                        <Link
                            to="/signup"
                            className={`user-nav-btn ${location.pathname === "/signup" ? "active" : ""}`}
                        >
                            📝 Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
