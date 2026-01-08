import Coupon from "../models/Coupon.js";
import { createRazorpayOffer } from "../utils/razorpayApi.js";

// Create Coupon (Admin)
// Create Coupon (Admin)
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, maxUses, expiresAt, description, isPublic, razorpayOfferId } = req.body;

        // 1. Basic Validation
        if (!code || !discountValue) {
            return res.status(400).json({ success: false, message: "Code and Value are required" });
        }
        if (discountType === 'percent' && (discountValue <= 0 || discountValue > 100)) {
            return res.status(400).json({ success: false, message: "Percentage must be between 1 and 100" });
        }
        if (discountType === 'fixed' && discountValue <= 0) {
            return res.status(400).json({ success: false, message: "Discount value must be positive" });
        }
        if (expiresAt && new Date(expiresAt) < new Date()) {
            return res.status(400).json({ success: false, message: "Expiry date must be in the future" });
        }

        // Check if code already exists
        const exists = await Coupon.findOne({ code: code.toUpperCase() });
        if (exists) {
            return res.status(400).json({ 
                success: false, 
                message: "Coupon code already exists" 
            });
        }

        // Normalize inputs
        const limit = (maxUses === "" || maxUses === null || maxUses === undefined) ? null : Number(maxUses);
        const expiry = (expiresAt === "" || expiresAt === null) ? null : expiresAt;

        let validatedOfferId = null;

        // Option 1: Manual Offer ID provided (takes priority)
        if (razorpayOfferId && razorpayOfferId.trim()) {
            const trimmedOfferId = razorpayOfferId.trim();
            
            if (/^offer_[A-Za-z0-9]+$/.test(trimmedOfferId)) {
                validatedOfferId = trimmedOfferId;
                console.log(`[Razorpay] Using manual Offer ID: ${validatedOfferId} for Coupon: ${code}`);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Razorpay Offer ID format. Must start with 'offer_' followed by alphanumeric characters."
                });
            }
        } 
        // Option 2: Auto-create offer via REST API
        else {
            try {
                console.log(`[Razorpay] Auto-creating offer for coupon: ${code}`);
                
                const offerPayload = {
                    name: `${code.toUpperCase()} Discount`,
                    display_text: description || `Get ${discountValue}${discountType === 'percent' ? '%' : '₹'} OFF`,
                    code: code.toUpperCase(),
                    type: 'recurring'
                };

                // Add discount based on type
                if (discountType === 'percent') {
                    offerPayload.percent_off = Number(discountValue);
                } else {
                    offerPayload.amount_off = Number(discountValue) * 100; // Convert to paise
                }

                console.log('[Razorpay] Offer Payload:', JSON.stringify(offerPayload, null, 2));

                const offer = await createRazorpayOffer(offerPayload);
                validatedOfferId = offer.id;
                
                console.log(`[Razorpay] ✅ Offer auto-created successfully: ${validatedOfferId}`);
            } catch (offerErr) {
                console.error(`[Razorpay] ⚠️ Auto-create failed:`, offerErr.message);
                // Continue without Razorpay sync - coupon will be "Local Only"
            }
        }

        // Create coupon in database
        const couponData = {
            code: code.toUpperCase(),
            discountType,
            discountValue,
            maxUses: limit,
            expiresAt: expiry,
            description,
            razorpayOfferId: validatedOfferId,
            isPublic: !!isPublic,
            createdBy: req.user._id
        };

        const coupon = await Coupon.create(couponData);
        
        console.log(`[DB] Coupon Created: ${coupon.code} | OfferID: ${coupon.razorpayOfferId || 'None (Local Only)'} | Public: ${coupon.isPublic}`);

        res.status(201).json({ success: true, coupon });
    } catch (error) {
        console.error("Create Coupon Error:", error);
        res.status(500).json({ success: false, message: "Failed to create coupon" });
    }
};

// Update Coupon (Admin)
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { maxUses, expiresAt, description, isPublic, discountValue, discountType } = req.body;
        
        const coupon = await Coupon.findById(id);
        if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

        // Validation for Updates
        if (expiresAt && new Date(expiresAt) < new Date()) {
             return res.status(400).json({ success: false, message: "Expiry date must be in the future" });
        }

        // Logic Lock: If synced with Razorpay, prevent value/type changes to avoid sync issues
        // Unless user explicitly force updates (not implemented yet, so just block)
        if (coupon.razorpayOfferId) {
             if ((discountValue && discountValue !== coupon.discountValue) || 
                 (discountType && discountType !== coupon.discountType)) {
                 return res.status(400).json({ 
                     success: false, 
                     message: "Cannot change Value/Type of Razorpay-synced coupon. Create a new one instead." 
                 });
             }
        }

        // Apply Updates
        if (maxUses !== undefined) coupon.maxUses = (maxUses === "" || maxUses === null) ? null : Number(maxUses);
        if (expiresAt !== undefined) coupon.expiresAt = (expiresAt === "" || expiresAt === null) ? null : expiresAt;
        if (description !== undefined) coupon.description = description;
        if (isPublic !== undefined) coupon.isPublic = isPublic;
        
        // Allow updating value if NOT synced with Razorpay
        if (!coupon.razorpayOfferId) {
            if (discountValue) coupon.discountValue = discountValue;
            if (discountType) coupon.discountType = discountType;
        }

        await coupon.save();
        
        console.log(`[DB] Coupon Updated: ${coupon.code}`);
        res.json({ success: true, coupon });

    } catch (error) {
        console.error("Update Coupon Error:", error);
        res.status(500).json({ success: false, message: "Failed to update coupon" });
    }
};

// Get Public Coupons (For Checkout Suggestions)
export const getPublicCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({
            isActive: true,
            isPublic: true,
            $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }]
        }).lean();

        // Further filter by usage in JS if needed, or query above fits most.
        // We only return valid ones.
        const validCoupons = coupons.filter(c => c.maxUses === null || c.usedCount < c.maxUses);

        res.json({ 
            success: true, 
            coupons: validCoupons.map(c => ({
                code: c.code,
                description: c.description,
                discountType: c.discountType,
                discountValue: c.discountValue
            }))
        });
    } catch (error) {
        console.error("Public Coupons Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch offers" });
    }
};

// Get All Coupons (Admin)
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch coupons" });
    }
};

// Toggle Active Status
export const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update coupon" });
    }
};

// Toggle Public Visibility
export const toggleCouponVisibility = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

        coupon.isPublic = !coupon.isPublic;
        await coupon.save();
        res.json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update coupon visibility" });
    }
};

// Delete Coupon
export const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete coupon" });
    }
};

// Validate Coupon (Public/Protected)
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid coupon code" });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({ success: false, message: "Coupon expired or limit reached" });
        }

        res.json({ 
            success: true, 
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                description: coupon.description,
                razorpayOfferId: coupon.razorpayOfferId // Frontend might need this for checkout
            }
        });
    } catch (error) {
        console.error("Validate Coupon Error:", error);
        res.status(500).json({ success: false, message: "Validation failed" });
    }
};
