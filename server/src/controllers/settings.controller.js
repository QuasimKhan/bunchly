import Settings from "../models/Settings.js";
import User from "../models/User.js";
import { sendPromotionalEmail } from "../utils/email.js";

// Singleton helper
const getSettingsDoc = async () => {
    let settings = await Settings.findById("global_settings");
    if (!settings) {
        settings = await Settings.create({ _id: "global_settings" });
    }
    return settings;
};

export const getSettings = async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        const settings = await Settings.findByIdAndUpdate(
            "global_settings",
            { $set: updates },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendBroadcast = async (req, res) => {
    try {
        const { subject, content, testEmail, audience = 'all', specificEmail, attachments = [] } = req.body;

        if (!subject || !content) {
            return res.status(400).json({ success: false, message: "Subject and Content are required" });
        }

        // Test Mode
        if (testEmail) {
            await sendPromotionalEmail(testEmail, subject, content, attachments);
            return res.status(200).json({ success: true, message: "Test email sent successfully" });
        }

        // Determine Audience
        let query = { isVerified: true }; // Default base query
        if (audience === 'pro') {
            query.plan = 'pro';
        } else if (audience === 'free') {
            query.plan = { $ne: 'pro' };
        } else if (audience === 'specific') {
            if (!specificEmail) {
                return res.status(400).json({ success: false, message: "Specific email is required" });
            }
            query.email = { $regex: new RegExp(`^${specificEmail}$`, 'i') }; // Case insensitive exact match
        }

        // Fetch Users
        const users = await User.find(query).select("email name");
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found matching criteria" });
        }

        // Return immediately to client
        res.status(200).json({ 
            success: true, 
            message: `Broadcast queued for ${users.length} users (${audience})` 
        });

        // Async Processing - Chunked Sender
        const BATCH_SIZE = 20;
        const DELAY_MS = 1000; // 1 second between batches

        const processBatch = async (batch) => {
            await Promise.all(
                batch.map(user => 
                    sendPromotionalEmail(user.email, subject, content, attachments)
                        .catch(err => console.error(`Failed to send to ${user.email}:`, err.message))
                )
            );
        };

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        (async () => {
             console.log(`Starting broadcast to ${users.length} users...`);
             for (let i = 0; i < users.length; i += BATCH_SIZE) {
                 const batch = users.slice(i, i + BATCH_SIZE);
                 await processBatch(batch);
                 console.log(`Sent batch ${i / BATCH_SIZE + 1} / ${Math.ceil(users.length / BATCH_SIZE)}`);
                 if (i + BATCH_SIZE < users.length) await sleep(DELAY_MS);
             }
             console.log("Broadcast completed.");
        })();

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message });
        } else {
            console.error("Broadcast init error:", error);
        }
    }
};
