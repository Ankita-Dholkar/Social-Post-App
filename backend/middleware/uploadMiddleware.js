const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for Multer
// NOTE: multer-storage-cloudinary@4 requires a function for params
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "social-post-app",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1000, crop: "limit", quality: "auto" }],
    // Use original filename (sanitized) as public_id
    public_id: `post_${Date.now()}`,
  }),
});

// Multer upload instance — max 5MB per file
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpg, png, gif, webp)"), false);
    }
  },
});

module.exports = { upload, cloudinary };
