import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { deleteUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/dashboard", requireAuth, (req, res) => {
    res.send("Dashboard and you are authorized");
});

userRouter.delete("/:userId", requireAuth, deleteUser);

export default userRouter;
