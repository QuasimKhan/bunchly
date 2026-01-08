import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    // Singleton ID (we only ever want one document)
    _id: { type: String, default: "global_settings" },
    
    // Sale Configuration
    saleActive: { type: Boolean, default: false },
    saleDiscount: { type: Number, default: 0 }, // Percent
    saleBannerText: { type: String, default: "Special Offer: Get 50% Off Pro Plans!" },
    saleBannerLink: { type: String, default: "/upgrade" },
    
    // Email Config (Optional, could be expanded)
    welcomeEmailSubject: { type: String, default: "Welcome to Bunchly! 🎉" },
}, { timestamps: true });

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
