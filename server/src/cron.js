import cron from "node-cron";
import { downgradeExpiredUsers, sendExpirationAlerts } from "./utils/planUtils.js";

export const startCronJobs = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("⏰ Running daily plan maintenance");
        await Promise.all([
            downgradeExpiredUsers(),
            sendExpirationAlerts()
        ]);
    });
};
