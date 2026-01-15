import { ENV } from "./env.js";

export const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        return callback(null, true);
    },
    credentials: true,
};
