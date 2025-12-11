import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "bunchly/profile",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            resource_type: "image",

            // optional: limit image resolution to avoid huge uploads
            transformation: [
                { width: 600, height: 600, crop: "limit" }
            ],
        };
    },
});

// Configure Multer
const uploadProfile = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max
    },
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    },
});

export default uploadProfile;
