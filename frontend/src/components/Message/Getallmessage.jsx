import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { MessageContext } from "../../context/Message";
import { UserContext } from "../../context/User";
import "./Getallmessage.css";

const Getallmessage = () => {
    const { id } = useParams(); // ID of the friend/user to chat with
    const navigate = useNavigate();
    const location = useLocation();

    const { messages, getMessages, sendMessage } = useContext(MessageContext);
    const { user_detail, isloggedin, getParticularUser } = useContext(UserContext);

    const [friendUser, setFriendUser] = useState(location.state?.user || null);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Fetch friend details if not provided via location.state
    useEffect(() => {
        const fetchFriendInfo = async () => {
            if (id) {
                if (!friendUser || friendUser._id !== id) {
                    if (getParticularUser) {
                        const data = await getParticularUser(id);
                        if (data) {
                            setFriendUser(data);
                        }
                    }
                }
            }
        };
        fetchFriendInfo();
    }, [id]);

    // Fetch messages for this conversation
    useEffect(() => {
        const loadMessages = async () => {
            if (id) {
                setLoading(true);
                if (getMessages) {
                    await getMessages(id);
                }
                setLoading(false);
            }
        };
        loadMessages();
    }, [id]);

    // Auto-scroll to the bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatMessageTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatMessageDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || sending || !id) return;

        setSending(true);
        const success = await sendMessage(id, trimmed);
        setSending(false);

        if (success) {
            setNewMessage("");
            inputRef.current?.focus();
        }
    };

    const handleQuickGreet = (text) => {
        setNewMessage(text);
        inputRef.current?.focus();
    };

    if (!isloggedin) {
        return (
            <div className="chat-container">
                <div className="chat-auth-card">
                    <span className="auth-card-icon">🔒</span>
                    <h2>Authentication Required</h2>
                    <p>Please log in or sign up to view and send messages.</p>
                    <div className="auth-card-actions">
                        <Link to="/login" className="chat-btn primary">
                            🔑 Login
                        </Link>
                        <Link to="/signup" className="chat-btn secondary">
                            📝 Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentUserId = user_detail?._id;
    const friendName = friendUser?.name || "Friend";

    return (
        <div className="chat-container">
            <div className="chat-wrapper">
                {/* Chat Top Header */}
                <div className="chat-header">
                    <div className="chat-header-left">
                        <button
                            onClick={() => navigate("/friends")}
                            className="chat-back-btn"
                            title="Back to Friends"
                        >
                            ← Back
                        </button>

                        <div className="chat-header-avatar">
                            {getInitials(friendName)}
                        </div>

                        <div className="chat-header-user-info">
                            <div className="chat-header-name-row">
                                <h2 className="chat-header-name">{friendName}</h2>
                                <span className="chat-friend-badge">✓ Friend</span>
                            </div>
                            <span className="chat-header-subtext">
                                {friendUser?.phone ? `📞 ${friendUser.phone}` : "💬 Direct Message"}
                            </span>
                        </div>
                    </div>

                    <div className="chat-header-actions">
                        <button
                            onClick={() => navigate(`/particularuser/${id}`, { state: { user: friendUser } })}
                            className="chat-view-profile-btn"
                            title="View Full Profile"
                        >
                            👤 View Profile
                        </button>
                    </div>
                </div>

                {/* Conversation Sub-bar explaining the directional layout */}
                <div className="chat-info-bar">
                    <div className="chat-info-pill me-pill">
                        <span className="pill-dot me-dot"></span>
                        <span>Sent by <strong>You</strong> (Right)</span>
                    </div>
                    <span className="chat-info-divider">↔</span>
                    <div className="chat-info-pill friend-pill">
                        <span className="pill-dot friend-dot"></span>
                        <span>Sent by <strong>{friendName}</strong> (Left)</span>
                    </div>
                </div>

                {/* Messages Body */}
                <div className="chat-messages-area">
                    {loading ? (
                        <div className="chat-loading">
                            <div className="chat-spinner"></div>
                            <p>Loading messages between you and {friendName}...</p>
                        </div>
                    ) : Array.isArray(messages) && messages.length > 0 ? (
                        <div className="chat-messages-list">
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUserId;
                                const senderDisplayName = isMe ? "You" : friendName;
                                const receiverDisplayName = isMe ? friendName : "You";

                                return (
                                    <div
                                        key={msg._id || index}
                                        className={`chat-message-row ${isMe ? "row-sent-by-me" : "row-sent-by-friend"}`}
                                    >
                                        {!isMe && (
                                            <div className="msg-avatar friend-msg-avatar" title={friendName}>
                                                {getInitials(friendName)}
                                            </div>
                                        )}

                                        <div className="msg-bubble-container">
                                            {/* Who sent to whom indicator */}
                                            <div className="msg-direction-tag">
                                                {isMe ? (
                                                    <span className="direction-sent">
                                                        <strong>You</strong> ➔ {friendName}
                                                    </span>
                                                ) : (
                                                    <span className="direction-received">
                                                        <strong>{friendName}</strong> ➔ You
                                                    </span>
                                                )}
                                            </div>

                                            {/* Message Bubble */}
                                            <div className={`msg-bubble ${isMe ? "bubble-sent" : "bubble-received"}`}>
                                                <p className="msg-text">{msg.text}</p>
                                                <div className="msg-footer">
                                                    <span className="msg-time">
                                                        {formatMessageTime(msg.createdAt)}
                                                    </span>
                                                    {isMe && <span className="msg-check">✓</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {isMe && (
                                            <div className="msg-avatar me-msg-avatar" title="You">
                                                {getInitials(user_detail?.name || "You")}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="chat-empty">
                            <span className="chat-empty-icon">💬</span>
                            <h3>No messages yet</h3>
                            <p>
                                This is the start of your direct conversation with <strong>{friendName}</strong>. Send a message to say hello!
                            </p>
                            <div className="chat-quick-replies">
                                <button
                                    type="button"
                                    onClick={() => handleQuickGreet("👋 Hello! How are you doing?")}
                                    className="quick-reply-btn"
                                >
                                    👋 Hello! How are you?
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickGreet("Hey there! Glad to connect with you.")}
                                    className="quick-reply-btn"
                                >
                                    ✨ Glad to connect!
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickGreet("Are you free to chat?")}
                                    className="quick-reply-btn"
                                >
                                    💬 Free to chat?
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSendMessage} className="chat-input-form">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={`Message ${friendName}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="chat-text-input"
                        disabled={sending}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="chat-send-btn"
                        title="Send Message"
                    >
                        {sending ? (
                            <span className="btn-spinner-small"></span>
                        ) : (
                            <>
                                <span className="send-icon">🚀</span>
                                <span className="send-text">Send</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Getallmessage;
