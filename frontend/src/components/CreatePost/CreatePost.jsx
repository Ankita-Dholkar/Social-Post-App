import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { createPostApi } from "../../services/postService";
import "./CreatePost.css";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const getInitials = (name = "") =>
    name.slice(0, 2).toUpperCase();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError("Please write something or attach an image.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      if (text.trim()) formData.append("textContent", text.trim());
      if (image) formData.append("image", image);

      const { data } = await createPostApi(formData);
      onPostCreated(data);

      // Reset form
      setText("");
      removeImage();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const canPost = (text.trim() || image) && !loading;

  return (
    <div className="create-post-card" id="create-post-card">
      <div className="create-post-header">
        <div className="create-post-avatar">{getInitials(user?.username)}</div>
        <textarea
          id="create-post-input"
          className="create-post-input"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          rows={text.length > 60 ? 3 : 1}
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="create-post-preview">
          <img src={imagePreview} alt="Preview" className="create-post-img-preview" />
          <button className="create-post-remove-img" onClick={removeImage} title="Remove image">
            ✕
          </button>
        </div>
      )}

      {/* Error */}
      {error && <p className="create-post-error">{error}</p>}

      {/* Footer Actions */}
      <div className="create-post-footer">
        <div className="create-post-actions">
          {/* Camera / Image Upload */}
          <button
            id="create-post-image-btn"
            className="create-post-action-btn"
            onClick={() => fileRef.current?.click()}
            title="Attach image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>Photo</span>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
            id="create-post-file-input"
          />
        </div>

        <button
          id="create-post-submit-btn"
          className={`create-post-submit ${canPost ? "active" : ""}`}
          onClick={handleSubmit}
          disabled={!canPost}
        >
          {loading ? (
            <span className="create-post-spinner" />
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              Post
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
