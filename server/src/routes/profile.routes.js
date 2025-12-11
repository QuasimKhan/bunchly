import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    deleteUser,
    getPublicProfile,
    updateProfile,
    uploadProfileController,
} from "../controllers/profile.controller.js";
import uploadProfile from "../middlewares/profileUpload.js";

const profileRouter = express.Router();

profileRouter.get("/dashboard", requireAuth, (req, res) => {
    res.send("Dashboard and you are authorized");
});

profileRouter.delete("/:userId", requireAuth, deleteUser);
profileRouter.patch("/update-profile", updateProfile);

profileRouter.get("/public/:username", getPublicProfile);
profileRouter.post(
    "/profile/upload",
    requireAuth,
    uploadProfile.single("image"),
    uploadProfileController
);

export default profileRouter;
