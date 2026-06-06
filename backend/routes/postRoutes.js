const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

// All post routes are protected (require login)
router.get("/", protect, getAllPosts);
router.post("/", protect, upload.single("image"), createPost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deletePost);

module.exports = router;
