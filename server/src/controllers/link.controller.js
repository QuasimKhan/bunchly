import Link from "../models/Link.js";
import { detectIconFromUrl } from "../utils/detectIconFromUrl.js";
import { PLANS } from "../config/plans.js";
import User from "../models/User.js";

// Create a new link
export const createLink = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, url, description } = req.body;
        let icon = req.body.icon;

        if (!title || !url) {
            return res.status(400).json({
                success: false,
                message: "Title and URL are required",
            });
        }

        if (!icon) {
            const detected = detectIconFromUrl(url);
            if (detected) icon = detected;
        }

        //PLAN ENFORCEMENT (Free vs Pro)
        const userPlanKey = req.user.plan || "free";
        const planRules = PLANS[userPlanKey];

        if (!planRules) {
            return res.status(400).json({
                success: false,
                message: "Invalid User Plan",
            });
        }

        const currentLinksCount = await Link.countDocuments({ userId });

        if (currentLinksCount >= planRules.maxLinks) {
            return res.status(403).json({
                success: false,
                code: "PLAN_LIMIT_REACHED",
                message: `Free plan allows up to ${planRules.maxLinks} links. Upgrade to Pro to add more.`,
            });
        }

        // determine order for new link
        const lastLink = await Link.findOne({ userId }).sort("-order");
        const order = lastLink ? lastLink.order + 1 : 1;

        const link = await Link.create({
            userId,
            title,
            url,
            description: description || "",
            icon: icon || "",
            order,
        });

        res.status(201).json({
            success: true,
            message: "Link created",
            data: link,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Get all links
export const getLinks = async (req, res) => {
    try {
        const userId = req.user._id;

        const links = await Link.find({ userId }).sort("order");

        res.status(200).json({
            success: true,
            message: "Fetched Successfully",
            data: links,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Update a link
export const updateLink = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const link = await Link.findOne({ _id: id, userId });
        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found or unauthorized",
            });
        }

        if (req.body.title !== undefined) link.title = req.body.title;
        if (req.body.url !== undefined) link.url = req.body.url;
        if (req.body.description !== undefined)
            link.description = req.body.description;
        if (req.body.icon !== undefined) link.icon = req.body.icon;
        if (req.body.isActive !== undefined) link.isActive = req.body.isActive;

        await link.save();

        res.status(200).json({
            success: true,
            message: "Link updated",
            data: link,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Delete link
export const deleteLink = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const deletedLink = await Link.findOneAndDelete({ _id: id, userId });
        if (!deletedLink) {
            return res.status(404).json({
                success: false,
                message: "Link not found or unauthorized",
            });
        }

        // 🟢 After deleting → reorder all links
        const userLinks = await Link.find({ userId }).sort("order");

        for (let i = 0; i < userLinks.length; i++) {
            userLinks[i].order = i + 1;
            await userLinks[i].save();
        }

        res.status(200).json({
            success: true,
            message: "Link deleted & order normalized",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Reorder links
// Reorder links (safe + validated)
export const reorderLinks = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: "orderedIds must be an array",
            });
        }

        // Normalize: keep only non-empty strings
        const cleanIds = orderedIds
            .map((id) => (id ? String(id).trim() : null))
            .filter((id) => id);

        if (cleanIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid IDs provided",
            });
        }

        // Optional: verify ownership/count to detect mismatches early
        const found = await Link.find({ _id: { $in: cleanIds }, userId })
            .select("_id")
            .lean();
        const foundIds = new Set(found.map((d) => String(d._id)));

        // If not all IDs belong to this user, reject with clear message
        const notOwned = cleanIds.filter((id) => !foundIds.has(id));
        if (notOwned.length > 0) {
            console.warn(
                "reorderLinks: received ids not owned by user:",
                notOwned
            );
            return res.status(403).json({
                success: false,
                message: "One or more links do not belong to you",
                notOwned,
            });
        }

        // Build bulk operations
        const operations = cleanIds.map((id, idx) => ({
            updateOne: {
                filter: { _id: id, userId },
                update: { $set: { order: idx + 1 } },
            },
        }));

        if (operations.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No operations to perform",
            });
        }

        // Execute bulk operation
        const result = await Link.bulkWrite(operations);

        // Optional: return the refreshed list so client can sync immediately
        const updatedLinks = await Link.find({ userId }).sort("order").lean();

        return res.status(200).json({
            success: true,
            message: "Links reordered",
            result,
            data: updatedLinks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const redirectLink = async (req, res) => {
    try {
        const { id } = req.params;

        const link = await Link.findById(id);

        if (!link || !link.isActive) {
            return res.status(404).json({
                success: false,
                message: "Not Found",
            });
        }

        await Link.updateOne({ _id: id }, { $inc: { clicks: 1 } });
        await User.updateOne(
            { _id: link.userId },
            {
                $inc: { "usage.totalClicks": 1 },
                $set: { "usage.lastActiveAt": new Date() },
            }
        );

        res.redirect(link.url);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
