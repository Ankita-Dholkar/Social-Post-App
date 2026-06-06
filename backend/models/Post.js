const mongoose = require("mongoose");

// Comment sub-document schema
const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text cannot be empty"],
      trim: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    // Text content — optional (but either text or image must be provided)
    textContent: {
      type: String,
      trim: true,
      default: "",
    },
    // Image stored on Cloudinary — optional
    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    // Stores usernames of people who liked this post
    likes: {
      type: [String],
      default: [],
    },
    // Embedded comments array
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
