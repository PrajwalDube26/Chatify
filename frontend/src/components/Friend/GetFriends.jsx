import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FriendContext } from "../../context/Friend";
import { UserContext } from "../../context/User";
import "./GetFriends.css";

const GetFriends = () => {
    const { friends, getFriends, deleteFriend } = useContext(FriendContext);
    const { isloggedin, user_detail, getUser } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriendList = async () => {
            setLoading(true);
            if (getFriends) {
                await getFriends();
            }
            if (getUser && (!user_detail || !user_detail._id)) {
                await getUser();
            }
            setLoading(false);
        };
        fetchFriendList();
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

    // Separate self and other friends to avoid duplicates
    const rawFriends = Array.isArray(friends) ? friends : [];
    const friendsWithoutSelf = rawFriends.filter((item) => {
        const u = item.friendId && typeof item.friendId === "object" ? item.friendId : item;
        const id = u?._id || item.friendId;
        return id !== user_detail?._id;
    });

    // Create self user entry if logged in
    const selfItem = user_detail && (user_detail._id || (user_detail.name && user_detail.name !== "User Name"))
        ? {
            _id: `self-${user_detail._id || "me"}`,
            isSelf: true,
            friendId: user_detail,
        }
        : null;

    // Combined list with self user at the top
    const combinedUsers = selfItem ? [selfItem, ...friendsWithoutSelf] : friendsWithoutSelf;

    // Filter friends list based on search term
    const filteredList = combinedUsers.filter((item) => {
        const user = item.friendId && typeof item.friendId === "object" ? item.friendId : item;
        const name = user?.name || "";
        const phone = user?.phone || "";
        const email = user?.email || "";

        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm) ||
            email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleUserClick = (userId, userObj, isSelf) => {
        if (isSelf) {
            navigate("/profile");
        } else if (userId) {
            navigate(`/getallmessage/${userId}`, { state: { user: userObj } });
        }
    };

    const handleDeleteFriend = async (e, friendUserId, friendName) => {
        e.stopPropagation(); // Prevent card navigation click

        const isConfirmed = window.confirm("are you confurm to delete this user from friend");

        if (isConfirmed) {
            setDeletingId(friendUserId);
            const success = await deleteFriend(friendUserId);
            setDeletingId(null);

            if (success) {
                setStatusMessage({
                    text: `${friendName || "User"} removed from friends successfully.`,
                    type: "success",
                });
            } else {
                setStatusMessage({
                    text: "Failed to remove friend. Please try again.",
                    type: "error",
                });
            }

            setTimeout(() => {
                setStatusMessage({ text: "", type: "" });
            }, 3500);
        }
    };

    if (!isloggedin) {
        return (
            <div className="friends-container">
                <div className="friends-auth-card">
                    <span className="auth-card-icon">🔒</span>
                    <h2>Authentication Required</h2>
                    <p>Please log in or sign up to view and manage your friend list.</p>
                    <div className="auth-card-actions">
                        <Link to="/login" className="friends-btn primary">
                            🔑 Login
                        </Link>
                        <Link to="/signup" className="friends-btn secondary">
                            📝 Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="friends-container">
            <div className="friends-wrapper">
                {/* Header Area */}
                <div className="friends-header">
                    <div className="friends-title-section">
                        <h1 className="friends-title">👥 My Friends</h1>
                        <p className="friends-subtitle">
                            View and manage your Chatify connections. Click any friend to view their profile, or remove them from your list.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="friends-search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, phone or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="friends-search-input"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search-btn"
                                onClick={() => setSearchTerm("")}
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Message Notification */}
                {statusMessage.text && (
                    <div className={`friends-status-banner ${statusMessage.type}`}>
                        {statusMessage.type === "success" ? "✅" : "⚠️"} {statusMessage.text}
                    </div>
                )}

                {/* Friends Count Info Bar */}
                <div className="friends-count-bar">
                    <span className="count-badge">
                        {loading
                            ? "Loading..."
                            : `${friendsWithoutSelf.length} ${friendsWithoutSelf.length === 1 ? "Friend" : "Friends"} connected`}
                    </span>
                    <Link to="/allusers" className="find-more-link">
                        🌐 Discover More Users →
                    </Link>
                </div>

                {/* Friends List */}
                <div className="friends-list">
                    {loading ? (
                        <div className="friends-loading">
                            <div className="friends-spinner"></div>
                            <p>Fetching your friends...</p>
                        </div>
                    ) : filteredList.length > 0 ? (
                        filteredList.map((item) => {
                            const friendUser = item.friendId && typeof item.friendId === "object" ? item.friendId : item;
                            const friendUserId = friendUser?._id || item.friendId;
                            const isSelf = item.isSelf || friendUserId === user_detail?._id;
                            const isDeleting = deletingId === friendUserId;

                            return (
                                <div
                                    key={item._id || friendUserId}
                                    className={`friend-strip ${isSelf ? "current-user-strip" : ""}`}
                                    onClick={() => handleUserClick(friendUserId, friendUser, isSelf)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleUserClick(friendUserId, friendUser, isSelf);
                                        }
                                    }}
                                >
                                    {/* Left Avatar */}
                                    <div className={`friend-strip-avatar ${isSelf ? "self-avatar" : ""}`}>
                                        {getInitials(friendUser?.name)}
                                    </div>

                                    {/* Middle Info */}
                                    <div className="friend-strip-info">
                                        <div className="friend-strip-name-row">
                                            <h3 className="friend-strip-name">
                                                {friendUser?.name || (isSelf ? "You" : "Unnamed Friend")}
                                            </h3>
                                            {isSelf ? (
                                                <span className="current-user-badge">You</span>
                                            ) : (
                                                <span className="friend-badge">✓ Friend</span>
                                            )}
                                        </div>

                                        <div className="friend-strip-details-row">
                                            {friendUser?.phone && (
                                                <div className="friend-detail-sub">
                                                    <span className="phone-icon">📞</span>
                                                    <span className="friend-phone">{friendUser.phone}</span>
                                                </div>
                                            )}
                                            {friendUser?.email && (
                                                <div className="friend-detail-sub">
                                                    <span className="email-icon">✉️</span>
                                                    <span className="friend-email">{friendUser.email}</span>
                                                </div>
                                            )}
                                            {friendUser?.location && (
                                                <div className="friend-detail-sub">
                                                    <span className="location-icon">📍</span>
                                                    <span className="friend-location">{friendUser.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="friend-strip-actions">
                                        {isSelf ? (
                                            <Link
                                                to="/profile"
                                                className="self-profile-btn"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                👤 Your Profile
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                className="friend-delete-btn"
                                                onClick={(e) => handleDeleteFriend(e, friendUserId, friendUser?.name)}
                                                disabled={isDeleting}
                                                title="Delete from friends"
                                            >
                                                {isDeleting ? (
                                                    <>
                                                        <span className="btn-spinner-small"></span> Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="delete-icon">🗑️</span> Delete Friend
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <div className="view-profile-cue" title="Open Chat">
                                            <span className="chat-cue-icon">💬</span>
                                            <span className="friend-strip-arrow">→</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="friends-empty">
                            <span className="empty-icon">👥</span>
                            <h3>{searchTerm ? "No matching friends found" : "No friends added yet"}</h3>
                            <p>
                                {searchTerm
                                    ? `No friends match "${searchTerm}". Try checking for spelling errors.`
                                    : "You have not added any friends to your list yet. Browse through other users to connect!"}
                            </p>
                            {!searchTerm && (
                                <Link to="/allusers" className="friends-btn primary empty-action-btn">
                                    🌐 Explore All Users
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetFriends;
