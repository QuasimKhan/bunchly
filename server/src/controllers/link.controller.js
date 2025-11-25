import Link from "../models/Link.js";

// Create a new link
export const createLink = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, url } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                success: false,
                message: "Title and URL are required",
            });
        }

        // determine order for new link
        const lastLink = await Link.findOne({ userId }).sort("-order");
        const order = lastLink ? lastLink.order + 1 : 1;

        const link = await Link.create({
            userId,
            title,
            url,
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

        Object.assign(link, req.body);
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

        res.status(200).json({
            success: true,
            message: "Link deleted",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Reorder links
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

        for (let i = 0; i < orderedIds.length; i++) {
            await Link.findOneAndUpdate(
                { _id: orderedIds[i], userId },
                { order: i + 1 }
            );
        }

        res.status(200).json({
            success: true,
            message: "Links reordered",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
