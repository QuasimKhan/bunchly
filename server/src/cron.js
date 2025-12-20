import cron from "node-cron";
import { downgradeExpiredUsers } from "./utils/planUtils.js";

export const startCronJobs = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("⏰ Running daily plan expiry check");
        await downgradeExpiredUsers();
    });
};
