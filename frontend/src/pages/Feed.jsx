import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar/Navbar";
import CreatePost from "../components/CreatePost/CreatePost";
import PostCard from "../components/PostCard/PostCard";
import { getAllPostsApi } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import "./Feed.css";

const FILTERS = [
  { key: "All Posts", icon: "🌐" },
  { key: "Most Liked", icon: "❤️" },
  { key: "Most Commented", icon: "💬" },
];

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAllPostsApi();
      setPosts(data);
    } catch {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  // Apply filter + search
  const filteredPosts = useMemo(() => {
    let list = [...posts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        if (q.startsWith("@")) {
          // If searching with @, only match usernames
          const userQ = q.slice(1);
          return (p.username || "").toLowerCase().includes(userQ);
        }
        // Otherwise match text OR username
        const textMatch = (p.textContent || "").toLowerCase().includes(q);
        const userMatch = (p.username || "").toLowerCase().includes(q);
        return textMatch || userMatch;
      });
    }
    if (filter === "Most Liked") list.sort((a, b) => b.likes.length - a.likes.length);
    if (filter === "Most Commented") list.sort((a, b) => b.comments.length - a.comments.length);
    return list;
  }, [posts, filter, searchQuery]);

  // Stats for right sidebar (updates dynamically with search/filters)
  const totalLikes = filteredPosts.reduce((sum, p) => sum + p.likes.length, 0);
  const totalComments = filteredPosts.reduce((sum, p) => sum + p.comments.length, 0);
  const uniqueUsers = [...new Set(filteredPosts.map((p) => p.username))];

  return (
    <div className="feed-page" id="feed-page">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="feed-layout">
        {/* ── Left Sidebar ── */}
        <aside className="feed-sidebar-left" id="feed-sidebar-left">
          {/* Profile Card */}
          <div className="sidebar-card profile-card">
            <div className="profile-card-banner" />
            <div className="profile-card-body">
              <div className="profile-card-avatar">
                {user?.username?.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="profile-card-name">{user?.username}</h3>
              <p className="profile-card-email">{user?.email}</p>
              <div className="profile-card-stats">
                <div className="profile-stat">
                  <span className="profile-stat-num">
                    {posts.filter((p) => p.username === user?.username).length}
                  </span>
                  <span className="profile-stat-label">Posts</span>
                </div>
                <div className="profile-stat-divider" />
                <div className="profile-stat">
                  <span className="profile-stat-num">
                    {posts.filter((p) => p.likes.includes(user?.username)).length}
                  </span>
                  <span className="profile-stat-label">Liked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Navigation */}
          <div className="sidebar-card">
            <h4 className="sidebar-section-title">Browse</h4>
            <nav className="sidebar-nav">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  id={`filter-${f.key.replace(/\s+/g, "-").toLowerCase()}`}
                  className={`sidebar-nav-item ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  <span className="sidebar-nav-icon">{f.icon}</span>
                  <span>{f.key}</span>
                  {f.key === "All Posts" && (
                    <span className="sidebar-nav-badge">{posts.length}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main Feed ── */}
        <main className="feed-main" id="feed-main">
          <CreatePost onPostCreated={handlePostCreated} />

          {/* Loading skeletons */}
          {loading && (
            <div className="feed-loading" id="feed-loading-spinner">
              {[1, 2, 3].map((i) => (
                <div key={i} className="post-skeleton">
                  <div className="skeleton-header">
                    <div className="skeleton-avatar" />
                    <div className="skeleton-lines">
                      <div className="skeleton-line short" />
                      <div className="skeleton-line xshort" />
                    </div>
                  </div>
                  <div className="skeleton-line" style={{ marginBottom: 8 }} />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" style={{ marginTop: 12 }} />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="feed-error" id="feed-error-msg">
              <span>⚠️ {error}</span>
              <button onClick={fetchPosts} className="feed-retry-btn">Retry</button>
            </div>
          )}

          {/* No results */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="feed-empty" id="feed-empty-state">
              <h3>
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No posts yet"}
              </h3>
              <p>
                {searchQuery
                  ? "Try a different keyword"
                  : "Be the first one to share something!"}
              </p>
            </div>
          )}

          {/* Posts */}
          {!loading &&
            !error &&
            filteredPosts.map((post, i) => (
              <div
                key={post._id}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <PostCard post={post} onDelete={handlePostDeleted} />
              </div>
            ))}
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="feed-sidebar-right" id="feed-sidebar-right">
          {/* Community Stats */}
          <div className="sidebar-card">
            <h4 className="sidebar-section-title">
              <TrendingUpIcon sx={{ fontSize: 17, verticalAlign: "middle", mr: 0.5 }} />
              Community Stats
            </h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-num">{posts.length}</span>
                <span className="stat-label">Total Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{totalLikes}</span>
                <span className="stat-label">Total Likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{totalComments}</span>
                <span className="stat-label">Comments</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{uniqueUsers.length}</span>
                <span className="stat-label">Members</span>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          {uniqueUsers.length > 0 && (
            <div className="sidebar-card">
              <h4 className="sidebar-section-title">
                <WhatshotIcon sx={{ fontSize: 17, verticalAlign: "middle", color: "#f57c00" }} />
                {" "}Top Contributors
              </h4>
              <div className="contributors-list">
                {uniqueUsers.slice(0, 5).map((uname) => {
                  const count = posts.filter((p) => p.username === uname).length;
                  return (
                    <div key={uname} className="contributor-item">
                      <div className="contributor-avatar">
                        {uname.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="contributor-info">
                        <span className="contributor-name">@{uname}</span>
                        <span className="contributor-posts">{count} post{count !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Feed;
