import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import ProfileView from "./models/ProfileView.js";
import LinkClick from "./models/LinkClick.js";
import Link from "./models/Link.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");

    const user = await User.findOne();
    if (!user) { console.log("No user"); process.exit(); }

    console.log(`Seeding for ${user.username}`);

    // Ensure user is PRO
    if (user.plan !== 'pro') {
        user.plan = 'pro';
        await user.save();
        console.log("Upgraded user to PRO");
    }

    // Create 50 Views over last 7 days
    const views = [];
    for(let i=0; i<50; i++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 7));
        views.push({
            userId: user._id,
            profileId: user._id, // assuming profileId = userId for now or similar
            device: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random()*3)],
            browser: 'Chrome',
            country: 'US',
            createdAt: d
        });
    }
    await ProfileView.insertMany(views);
    console.log("Inserted 50 profile views");

    // Create Clicks
    // Need a link
    let link = await Link.findOne({ userId: user._id });
    if (!link) {
        link = await Link.create({ userId: user._id, title: "Test Link", url: "https://google.com" });
    }

    const clicks = [];
    for(let i=0; i<20; i++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 7));
        clicks.push({
            userId: user._id,
            linkId: link._id,
            device: 'mobile',
            referrer: 'instagram',
            createdAt: d
        });
    }
    await LinkClick.insertMany(clicks);
    console.log("Inserted 20 link clicks");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
