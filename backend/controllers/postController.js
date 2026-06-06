const Post = require("../models/Post");
const { cloudinary } = require("../middleware/uploadMiddleware");

// ─────────────────────────────────────────────
// @desc    Create a new post (text or image or both)
// @route   POST /api/posts
// @access  Private
// ─────────────────────────────────────────────
const createPost = async (req, res) => {
  try {
    const { textContent } = req.body;
    const imageUrl = req.file ? req.file.path : "";
    const imagePublicId = req.file ? req.file.filename : "";

    // Ensure at least text or image is provided
    if (!textContent && !imageUrl) {
      return res.status(400).json({ message: "Post must have text or an image" });
    }

    const post = await Post.create({
      userId: req.user._id,
      username: req.user.username,
      textContent: textContent || "",
      imageUrl,
      imagePublicId,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error.message);
    res.status(500).json({ message: "Server error while creating post" });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all posts (newest first)
// @route   GET /api/posts
// @access  Private
// ─────────────────────────────────────────────
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Get posts error:", error.message);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
};

// ─────────────────────────────────────────────
// @desc    Toggle like on a post (like or unlike)
// @route   PUT /api/posts/:id/like
// @access  Private
// ─────────────────────────────────────────────
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const username = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      // Unlike: remove the username from the likes array
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      // Like: add the username to the likes array
      post.likes.push(username);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, liked: !alreadyLiked });
  } catch (error) {
    console.error("Toggle like error:", error.message);
    res.status(500).json({ message: "Server error while toggling like" });
  }
};

// ─────────────────────────────────────────────
// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
// ─────────────────────────────────────────────
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId: req.user._id,
      username: req.user.username,
      text: text.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    // Return the newly added comment (last item in array)
    const addedComment = post.comments[post.comments.length - 1];
    res.status(201).json({ comment: addedComment, comments: post.comments });
  } catch (error) {
    console.error("Add comment error:", error.message);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a post (only the owner)
// @route   DELETE /api/posts/:id
// @access  Private
// ─────────────────────────────────────────────
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only the owner can delete their post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // Delete image from Cloudinary if it exists
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error.message);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};

module.exports = { createPost, getAllPosts, toggleLike, addComment, deletePost };
