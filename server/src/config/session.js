import session from "express-session";
import MongoStore from "connect-mongo";
import { ENV } from "./env.js";

export const sessionMiddleware = session({
    secret: ENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: ENV.MONGO_URI,
        collectionName: "session",
    }),
    cookie: {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
});
