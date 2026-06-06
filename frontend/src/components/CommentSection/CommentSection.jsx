import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { addCommentApi } from "../../services/postService";
import "./CommentSection.css";

const CommentSection = ({ postId, comments: initialComments, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getInitials = (name = "") => name.slice(0, 2).toUpperCase();

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await addCommentApi(postId, text.trim());
      setComments(data.comments);
      setText("");
      if (onCommentAdded) onCommentAdded(data.comments.length);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section" id={`comment-section-${postId}`}>
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="comment-list">
          {comments.map((c) => (
            <div key={c._id} className="comment-item animate-fadeIn">
              <div className="comment-avatar">{getInitials(c.username)}</div>
              <div className="comment-body">
                <div className="comment-header-row">
                  <span className="comment-username">@{c.username}</span>
                  <span className="comment-time">{formatTime(c.createdAt)}</span>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment */}
      <form
        className="comment-input-row"
        onSubmit={handleSubmit}
        id={`comment-form-${postId}`}
      >
        <div className="comment-input-avatar">{getInitials(user?.username)}</div>
        <div className="comment-input-wrap">
          <input
            className="comment-input"
            id={`comment-input-${postId}`}
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => { setText(e.target.value); setError(""); }}
            disabled={loading}
            maxLength={300}
          />
          <button
            type="submit"
            className={`comment-send-btn ${text.trim() ? "active" : ""}`}
            disabled={!text.trim() || loading}
            id={`comment-send-${postId}`}
          >
            {loading ? "…" : "↑"}
          </button>
        </div>
      </form>

      {error && <p className="comment-error">{error}</p>}
    </div>
  );
};

export default CommentSection;
