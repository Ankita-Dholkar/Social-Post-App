import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toggleLikeApi, deletePostApi } from "../../services/postService";
import CommentSection from "../CommentSection/CommentSection";
import "./PostCard.css";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isLiked = likes.includes(user?.username);
  const isOwner = post.userId === user?._id || post.username === user?.username;

  const getInitials = (name = "") => name.slice(0, 2).toUpperCase();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    // Optimistic update
    const wasLiked = likes.includes(user.username);
    setLikes(wasLiked
      ? likes.filter((u) => u !== user.username)
      : [...likes, user.username]
    );

    try {
      const { data } = await toggleLikeApi(post._id);
      setLikes(data.likes);
    } catch {
      // Revert on error
      setLikes(wasLiked
        ? [...likes]
        : likes.filter((u) => u !== user.username)
      );
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    setDeleteLoading(true);
    try {
      await deletePostApi(post._id);
      onDelete(post._id);
    } catch {
      alert("Failed to delete post.");
      setDeleteLoading(false);
    }
  };

  return (
    <article className="post-card animate-fadeInUp" id={`post-${post._id}`}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-avatar">{getInitials(post.username)}</div>
        <div className="post-meta">
          <span className="post-username">@{post.username}</span>
          <span className="post-time">{formatDate(post.createdAt)}</span>
        </div>
        {isOwner && (
          <button
            className="post-delete-btn"
            id={`post-delete-${post._id}`}
            onClick={handleDelete}
            disabled={deleteLoading}
            title="Delete post"
          >
            {deleteLoading ? "…" : "🗑"}
          </button>
        )}
      </div>

      {/* Post Content */}
      {post.textContent && (
        <p className="post-text">{post.textContent}</p>
      )}

      {/* Post Image */}
      {post.imageUrl && (
        <div className="post-image-wrap">
          <img
            src={post.imageUrl}
            alt="Post"
            className="post-image"
            loading="lazy"
          />
        </div>
      )}

      {/* Like & Comment Stats */}
      <div className="post-stats">
        {likes.length > 0 && (
          <span className="post-stat">
            ❤️ {likes.length} {likes.length === 1 ? "like" : "likes"}
          </span>
        )}
        {commentCount > 0 && (
          <span
            className="post-stat clickable"
            onClick={() => setShowComments(true)}
          >
            💬 {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="post-actions">
        <button
          id={`like-btn-${post._id}`}
          className={`post-action-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          <span className={`like-icon ${isLiked ? "liked" : ""}`}>
            {isLiked ? "❤️" : "🤍"}
          </span>
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          id={`comment-toggle-btn-${post._id}`}
          className="post-action-btn"
          onClick={() => setShowComments((s) => !s)}
        >
          <span>💬</span>
          <span>Comment</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCommentAdded={(count) => setCommentCount(count)}
        />
      )}
    </article>
  );
};

export default PostCard;
