import Link from "../models/Link.js";

export const createLink = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { title, url } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                success: false,
                message: "Title and URL are required",
            });
        }

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

export const getLinks = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized",
            });
        }
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

export const updateLink = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "slug is required",
            });
        }

        const link = await Link.findByIdAndUpdate({ _id: id, userId });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found or not belog to yours",
            });
        }

        Object.assign(link, req.body);
        await link.save();

        res.status(200).json({
            success: true,
            message: "Link Editied",
            data: link,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const deleteLink = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Slug required",
            });
        }

        const deletedLink = await Link.findOneAndDelete({ _id: id, userId });
        if (!deletedLink) {
            return res.status(400).json({
                success: false,
                message: "Link not found or not yours",
            });
        }

        res.status(200).json({
            success: true,
            message: "Link deleted",
            data: deletedLink,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const reorderLinks = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { orderedIds } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthoried",
            });
        }

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
