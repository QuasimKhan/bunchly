import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

const startServer = async () => {
    await connectDB();

    app.listen(ENV.PORT, "0.0.0.0", () => {
        console.log(`Server running on port http://localhost:${ENV.PORT}`);
    });
};

startServer();
