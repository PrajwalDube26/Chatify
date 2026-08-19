import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "../../context/User";
import { FriendContext } from "../../context/Friend";
import "./Featchparticularuser.css";

const Featchparticularuser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { getParticularUser, particular_user, isloggedin, user_detail } = useContext(UserContext);
    const { addFriend, friends, getFriends } = useContext(FriendContext);

    const [user, setUser] = useState(location.state?.user || null);
    const [loading, setLoading] = useState(!location.state?.user);
    const [adding, setAdding] = useState(false);
    const [addStatus, setAddStatus] = useState(null); // 'success' | 'error' | null
    const [statusMessage, setStatusMessage] = useState("");

    // Fetch user details on component mount or id change
    useEffect(() => {
        const fetchDetails = async () => {
            if (id) {
                setLoading(true);
                const data = await getParticularUser(id);
                if (data) {
                    setUser(data);
                }
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // Ensure friends list is up-to-date
    useEffect(() => {
        if (getFriends) {
            getFriends();
        }
    }, []);

    // Check if user is already a friend
    const isFriend = Array.isArray(friends) && friends.some((f) => {
        const friendObjId = f.friendId?._id || f.friendId;
        return friendObjId === id;
    });

    const isSelf = user_detail?._id === id;

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (date) => {
        if (!date) return "Not Available";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const handleAddFriend = async () => {
        if (adding || isFriend || isSelf) return;

        setAdding(true);
        setAddStatus(null);
        setStatusMessage("");

        const success = await addFriend(id);
        setAdding(false);

        if (success) {
            setAddStatus("success");
            setStatusMessage("Friend added successfully!");
        } else {
            setAddStatus("error");
            setStatusMessage("Could not add friend. Already in friend list or server error.");
        }

        // Auto-clear message after 4 seconds
        setTimeout(() => {
            setStatusMessage("");
        }, 4000);
    };

    if (!isloggedin) {
        return (
            <div className="particular-user-container">
                <div className="particular-user-card auth-warning">
                    <span className="warning-icon">🔒</span>
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to view user profile details.</p>
                    <Link to="/login" className="particular-action-btn primary">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="particular-user-container">
                <div className="particular-user-card loading-card">
                    <div className="particular-spinner"></div>
                    <p>Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="particular-user-container">
                <div className="particular-user-card empty-card">
                    <span className="empty-icon">⚠️</span>
                    <h2>User Not Found</h2>
                    <p>The user you are looking for does not exist or has been removed.</p>
                    <button onClick={() => navigate("/allusers")} className="particular-action-btn secondary">
                        ← Back to All Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="particular-user-container">
            <div className="particular-user-card">
                {/* Back Navigation Button */}
                <div className="card-top-bar">
                    <button
                        onClick={() => navigate("/allusers")}
                        className="back-btn"
                        title="Back to All Users"
                    >
                        ← Back to Users
                    </button>
                    {isSelf && <span className="self-tag">Your Profile</span>}
                    {isFriend && <span className="friend-tag">✓ Friend</span>}
                </div>

                {/* Header / Avatar */}
                <div className="particular-user-header">
                    <div className="particular-user-avatar">
                        {getInitials(user.name)}
                    </div>
                    <h2 className="particular-user-name">
                        {user.name || "User Name"}
                    </h2>
                    <p className="particular-user-badge">
                        💬 Chatify Member
                    </p>
                </div>

                {/* Status Message Toast */}
                {statusMessage && (
                    <div className={`particular-status-banner ${addStatus}`}>
                        {addStatus === "success" ? "✅" : "⚠️"} {statusMessage}
                    </div>
                )}

                {/* Details Section */}
                <div className="particular-user-details">
                    <div className="particular-detail-item">
                        <span className="particular-detail-label">Name</span>
                        <span className="particular-detail-value">{user.name || "Not Available"}</span>
                    </div>

                    <div className="particular-detail-item">
                        <span className="particular-detail-label">Email</span>
                        <span className="particular-detail-value">{user.email || "Not Available"}</span>
                    </div>

                    <div className="particular-detail-item">
                        <span className="particular-detail-label">Phone</span>
                        <span className="particular-detail-value">{user.phone || "Not Available"}</span>
                    </div>

                    <div className="particular-detail-item">
                        <span className="particular-detail-label">Location</span>
                        <span className="particular-detail-value">{user.location || "Not Available"}</span>
                    </div>

                    <div className="particular-detail-item">
                        <span className="particular-detail-label">Member Since</span>
                        <span className="particular-detail-value">{formatDate(user.createdAt)}</span>
                    </div>

                    <div className="particular-detail-item">
                        <span className="particular-detail-label">User ID</span>
                        <span className="particular-detail-value id-code">
                            {user._id ? user._id : "Not Available"}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="particular-user-actions">
                    {!isSelf ? (
                        <button
                            onClick={handleAddFriend}
                            disabled={adding || isFriend}
                            className={`particular-action-btn ${isFriend ? "already-friend" : "add-friend-btn"}`}
                        >
                            {adding ? (
                                <>
                                    <span className="btn-spinner"></span> Adding...
                                </>
                            ) : isFriend ? (
                                <>✓ Already in Friends</>
                            ) : (
                                <>➕ Add Into Friends</>
                            )}
                        </button>
                    ) : (
                        <Link to="/updateuser" className="particular-action-btn primary">
                            ✏️ Edit Your Profile
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Featchparticularuser;
