import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { 
    getAdminStats, 
    getUsers, 
    updateUserStatus, 
    deleteUser,
    getPayments,
    processRefund,
    getRefundRequests,
    getUserDetails,
    updateUserPlan,
    deleteUserLink,
    logoutUserSession,
    logoutUserEverywhere
} from "../controllers/admin.controller.js";
import { getRevenueStats, emailRevenueReport } from "../controllers/revenue.controller.js";
import { 
    createCoupon, 
    getCoupons, 
    toggleCouponStatus, 
    toggleCouponVisibility, 
    updateCoupon,
    deleteCoupon 
} from "../controllers/coupon.controller.js";

const router = express.Router();

// All routes require Admin privileges
router.use(requireAuth, requireAdmin);

router.get("/stats", getAdminStats);
router.get("/revenue", getRevenueStats); // Added revenue route
router.post("/revenue/email", emailRevenueReport);
router.get("/users", getUsers);
router.patch("/users/:userId", updateUserStatus);
router.delete("/users/:userId", deleteUser);

// Coupons
router.post("/coupons", createCoupon);
router.get("/coupons", getCoupons);
router.patch("/coupons/:id", toggleCouponStatus);
router.patch("/coupons/:id/visibility", toggleCouponVisibility);
router.patch("/coupons/:id/edit", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// User Deep Inspection & Control
router.get("/users/:id/details", getUserDetails);
router.patch("/users/:id/plan", updateUserPlan);
router.post("/users/logout-session", logoutUserSession);
router.post("/users/:userId/logout-all", logoutUserEverywhere);
router.delete("/links/:linkId", deleteUserLink);

// Payment Routes
router.get("/payments", getPayments);
router.get("/refunds", getRefundRequests);
router.post("/payments/:id/refund", processRefund);

export default router;
