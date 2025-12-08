import multer from "multer";
import { cloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new cloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "bunchly/profile",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const uploadProfile = multer({ storage: storage });

export default uploadProfile;
