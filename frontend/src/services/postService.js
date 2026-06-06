import API from "./authService";

// Get all posts (newest first)
export const getAllPostsApi = () => API.get("/posts");

// Create a new post (FormData — supports text + image)
export const createPostApi = (formData) =>
  API.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Toggle like on a post
export const toggleLikeApi = (postId) => API.put(`/posts/${postId}/like`);

// Add a comment to a post
export const addCommentApi = (postId, text) =>
  API.post(`/posts/${postId}/comment`, { text });

// Delete a post
export const deletePostApi = (postId) => API.delete(`/posts/${postId}`);
