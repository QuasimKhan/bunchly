import razorpay from "../config/razorpay.js";
import { PRICING } from "../config/pricing.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import Settings from "../models/Settings.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";
import { proReceiptEmail } from "../utils/proReceiptEmail.js";
import { sendEmail } from "../utils/brevoEmail.js";
import { generateInvoicePdf } from "../utils/generateInvoicePdf.js";

// Create One-Time Order for Pro Plan
export const createProOrder = async (req, res) => {
    try {
        const user = req.user;
        const { couponCode } = req.body;

        if (user.plan === "pro") {
            return res.status(400).json({ success: false, message: "You are already on Pro plan" });
        }

        const BASE_PRICE = PRICING.pro.monthly.amount; // 4900 paise (₹49)
        const PLATFORM_FEE = 100; // ₹1 platform fee

        let appliedCoupon = null;
        let discountAmount = 0;

        // 1. Check Global Sale Settings first
        const settings = await Settings.findOne();
        
        let globalSaleApplied = false;
        if (settings?.saleActive && couponCode === "SPECIAL OFFER") {
             // Apply Global Discount
             console.log(`[Checkout] Applying Global Sale: ${settings.saleDiscount}%`);
             discountAmount = Math.floor(BASE_PRICE * (settings.saleDiscount / 100));
             appliedCoupon = { code: "SPECIAL OFFER", discountValue: settings.saleDiscount }; // Mock for notes
             globalSaleApplied = true;
        }

        // 2. If no global sale applied, check DB coupons
        if (!globalSaleApplied && couponCode) {
            console.log(`[Checkout] Validating Code: ${couponCode}`);
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            
            if (!coupon) {
                console.log(`[Checkout] Coupon NOT found in DB: ${couponCode}`);
            } else {
                const isValid = coupon.isValid();
                console.log(`[Checkout] Coupon Found: ${couponCode} | Valid: ${isValid}`);
                
                if (isValid) {
                    appliedCoupon = coupon;
                    
                    // Calculate discount
                    if (coupon.discountType === 'percent') {
                        discountAmount = Math.floor(BASE_PRICE * (coupon.discountValue / 100));
                    } else {
                        discountAmount = coupon.discountValue * 100; // Convert to paise
                    }
                }
            }
        }

        // Calculate final amount (in paise)
        const finalAmount = Math.max(100, BASE_PRICE + PLATFORM_FEE - discountAmount); // Minimum ₹1

        console.log(`[Payment] Base: ₹${BASE_PRICE/100} | Discount: ₹${discountAmount/100} | Fee: ₹${PLATFORM_FEE/100} | Final: ₹${finalAmount/100}`);

        // Create Razorpay Order
        const orderOptions = {
            amount: finalAmount,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`, // Short receipt (max 40 chars)
            notes: {
                userId: user._id.toString(),
                plan: "pro_monthly",
                coupon: appliedCoupon ? appliedCoupon.code : "",
                discountAmount: discountAmount.toString()
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        console.log(`[Razorpay] Order Created: ${order.id} | Amount: ₹${order.amount / 100} | Key End: ...${process.env.RAZORPAY_KEY_ID?.slice(-4)}`);

        console.log(`[Razorpay] Order Created: ${order.id} | Amount: ₹${order.amount / 100}`);

        return res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({ success: false, message: "Failed to create order" });
    }
};

// Verify Pro Payment (One-Time Order)
export const verifyProPayment = async (req, res) => {
    try {
        console.log('[Verify] Starting payment verification...');
        console.log('[Verify] Request body:', JSON.stringify(req.body, null, 2));
        
        const userId = req.user._id;
        const { 
            razorpay_payment_id, 
            razorpay_order_id, 
            razorpay_signature,
            couponCode 
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.error('[Verify] Missing required fields');
            return res.status(400).json({ success: false, message: "Payment details missing" });
        }

        console.log('[Verify] Validating signature...');
        
        // Verify Signature
        // Formula for Orders: razorpay_order_id + "|" + razorpay_payment_id
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            console.error('[Verify] Signature mismatch!');
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        console.log('[Verify] Signature valid ✓');

        // Coupon Tracking
        let discountAmount = 0;
        if (couponCode === "SPECIAL OFFER") {
            // Global Sale - No DB lookup needed, but we should verify settings if we want to be strict.
            // For now, calculating discount solely for the record based on what was likely paid or just logging it.
            // Since payment is already done and verified via signature, we trust the amount paid.
            // However, to fill the 'discountAmount' field:
             const settings = await Settings.findOne();
             if (settings) {
                 const basePrice = PRICING.pro.monthly.amount;
                 discountAmount = Math.floor(basePrice * (settings.saleDiscount / 100));
             }
        } else if (couponCode) {
            console.log(`[Verify] Processing coupon: ${couponCode}`);
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon) {
                const basePrice = PRICING.pro.monthly.amount;
                discountAmount = coupon.discountType === 'percent' 
                    ? Math.floor(basePrice * (coupon.discountValue / 100))
                    : (coupon.discountValue * 100);
                 
                await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
                console.log(`[Verify] Coupon ${couponCode} usage incremented`);
            }
        }

        // Activate Pro for 30 days
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        console.log('[Verify] Updating user to Pro...');
        
        await User.findByIdAndUpdate(userId, {
            plan: "pro",
            planExpiresAt: expiryDate,
            subscription: {
                provider: "razorpay",
                id: razorpay_order_id,
                paymentId: razorpay_payment_id,
                status: "active",
                autoPay: false
            }
        });

        console.log('[Verify] User upgraded to Pro ✓');

        const invoiceNumber = `INV-${Date.now()}`;
        
        // Fetch actual payment to get the exact amount charged
        console.log('[Verify] Fetching payment details from Razorpay...');
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        const paidAmount = payment.amount;

        console.log(`[Verify] Payment amount: ₹${paidAmount / 100}`);

        // Record Payment
        await Payment.create({
            userId,
            plan: "pro",
            amount: paidAmount,
            currency: "INR",
            provider: "razorpay",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            invoiceNumber,
            status: "paid",
            autoPay: false,
            couponCode: couponCode || null,
            discountAmount
        });

        console.log('[Verify] Payment record created ✓');

        // Generate PDF & Email
        const pdfDoc = generateInvoicePdf({
            invoiceNumber,
            name: req.user.name,
            email: req.user.email,
            plan: "Pro (Monthly Plan)",
            amount: paidAmount,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            date: new Date().toDateString(),
        });

        const pdfBuffer = await new Promise((resolve) => {
            const buffers = [];
            pdfDoc.on("data", buffers.push.bind(buffers));
            pdfDoc.on("end", () => resolve(Buffer.concat(buffers)));
            pdfDoc.end();
        });

        const emailPayload = proReceiptEmail({
            name: req.user.name,
            email: req.user.email,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: paidAmount,
            date: new Date().toDateString(),
        });
        
        // Send Email
        try {
            await sendEmail({
                to: req.user.email,
                subject: "Bunchly Pro Activated - Welcome!",
                html: emailPayload.html,
                attachments: [{ filename: `Invoice-${invoiceNumber}.pdf`, content: pdfBuffer }]
            });
            console.log('[Verify] Email sent ✓');
        } catch(e) { 
            console.error("[Verify] Email send failed:", e); 
        }

        console.log('[Verify] ✅ Verification complete!');

        return res.status(200).json({
            success: true,
            message: "Pro activated successfully",
            expiresAt: expiryDate
        });

    } catch (error) {
        console.error("❌ [Verify] Error:", error);
        console.error("❌ [Verify] Stack:", error.stack);
        return res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};


