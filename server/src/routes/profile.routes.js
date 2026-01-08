import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    changePassword,
    deleteUser,
    getPublicProfile,
    updateProfile,
    uploadProfileController,
    uploadBackgroundController,
    getShowcaseProfiles,
} from "../controllers/profile.controller.js";
import uploadProfile from "../middlewares/profileUpload.js";

const profileRouter = express.Router();

profileRouter.get("/dashboard", requireAuth, (req, res) => {
    res.send("Dashboard and you are authorized");
});

profileRouter.get("/showcase", getShowcaseProfiles);

profileRouter.delete("/:userId", requireAuth, deleteUser);
profileRouter.patch("/update-profile", updateProfile);

profileRouter.get("/public/:username", getPublicProfile);
profileRouter.post(
    "/profile/upload",
    requireAuth,
    uploadProfile.single("image"),
    uploadProfileController
);
profileRouter.post(
    "/profile/upload-bg",
    requireAuth,
    uploadProfile.single("image"), // Frontend must use formData.append("image", file)
    uploadBackgroundController
);

profileRouter.post("/change-password", requireAuth, changePassword);

export default profileRouter;
