import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/User";
import "./Allusers.css";

const Allusers = () => {
    const { getAllUsers, all_users, user_detail, isloggedin } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            if (getAllUsers) {
                await getAllUsers();
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Filter out current user from other users list (or show with a tag) and search query
    const filteredUsers = Array.isArray(all_users)
        ? all_users.filter((user) => {
            const matchesSearch =
                (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.phone && user.phone.includes(searchTerm));
            return matchesSearch;
        })
        : [];

    const handleUserClick = (userId, user) => {
        navigate(`/particularuser/${userId}`, { state: { user } });
    };

    if (!isloggedin) {
        return (
            <div className="allusers-container">
                <div className="allusers-auth-card">
                    <span className="auth-card-icon">🔒</span>
                    <h2>Authentication Required</h2>
                    <p>Please log in or sign up to view and discover Chatify users.</p>
                    <div className="auth-card-actions">
                        <Link to="/login" className="allusers-btn primary">
                            🔑 Login
                        </Link>
                        <Link to="/signup" className="allusers-btn secondary">
                            📝 Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="allusers-container">
            <div className="allusers-wrapper">
                {/* Header Area */}
                <div className="allusers-header">
                    <div className="allusers-title-section">
                        <h1 className="allusers-title">🌐 Other Users</h1>
                        <p className="allusers-subtitle">
                            Connect with people across Chatify. Click any user to view details and add them as friends.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="allusers-search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name or phone number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="allusers-search-input"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search-btn"
                                onClick={() => setSearchTerm("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Users Count Info */}
                <div className="allusers-count-bar">
                    <span className="count-badge">
                        {loading ? "Loading users..." : `${filteredUsers.length} Users found`}
                    </span>
                </div>

                {/* Users Strip List */}
                <div className="allusers-list">
                    {loading ? (
                        <div className="allusers-loading">
                            <div className="allusers-spinner"></div>
                            <p>Fetching users...</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                            const isCurrentUser = user_detail?._id === user._id;

                            return (
                                <div
                                    key={user._id}
                                    className={`user-strip ${isCurrentUser ? "current-user-strip" : ""}`}
                                    onClick={() => handleUserClick(user._id, user)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleUserClick(user._id, user);
                                        }
                                    }}
                                >
                                    {/* Left Avatar */}
                                    <div className="user-strip-avatar">
                                        {getInitials(user.name)}
                                    </div>

                                    {/* Middle Info */}
                                    <div className="user-strip-info">
                                        <div className="user-strip-name-row">
                                            <h3 className="user-strip-name">{user.name || "Unnamed User"}</h3>
                                            {isCurrentUser && (
                                                <span className="current-user-badge">You</span>
                                            )}
                                        </div>
                                        <div className="user-strip-phone-row">
                                            <span className="phone-icon">📞</span>
                                            <span className="user-strip-phone">
                                                {user.phone ? user.phone : "No phone number"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right Action / Arrow */}
                                    <div className="user-strip-action">
                                        <span className="view-profile-text">View Profile</span>
                                        <span className="user-strip-arrow">→</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="allusers-empty">
                            <span className="empty-icon">👥</span>
                            <h3>No users found</h3>
                            <p>
                                {searchTerm
                                    ? `No users match "${searchTerm}". Try a different search.`
                                    : "No other users have registered yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Allusers;
