import { ENV } from "./env.js";

export const corsOptions = {
    origin: ENV.CLIENT_URL,
    credentials: true,
};
