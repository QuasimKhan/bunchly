# ⚡ Bunchly

**The Ultimate Premium "Bio Link" SaaS Platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-MERN-blue?logo=react&logoColor=white)](https://react.dev/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green)]()

> **Live Demo:** [bunchly.in](https://bunchly.in)  
> **API:** [api.bunchly.in](https://api.bunchly.in)

**Bunchly** is a high-performance, aesthetically pleasing, and feature-rich platform enabling creators to consolidate their digital identity. Built with a focus on **premium design** and **scalable architecture**, it offers a "God Mode" SaaS experience with integrated payments, analytics, and deep customization.

![Bunchly Preview](https://via.placeholder.com/1200x600?text=Bunchly+Premium+Dashboard)

---

## 📚 Developer Documentation

We have prepared comprehensive documentation for developers and interview preparation. 

- [**📂 Project Overview & Architecture**](./docs/interview_notes/01_Overview_Architecture.md) - Tech stack, high-level design, and monorepo structure.
- [**⚙️ Backend Deep Dive**](./docs/interview_notes/02_Backend_Deep_Dive.md) - Auth flows, database schema, and API structure.
- [**🎨 Frontend Deep Dive**](./docs/interview_notes/03_Frontend_Deep_Dive.md) - React architecture, state management, and styling.
- [**🔄 Key User Flows**](./docs/interview_notes/04_Key_Flows.md) - Detailed breakdown of Payment, Auth, and Link Rendering cycles.
- [**🗄️ Database Schema**](./docs/interview_notes/05_Database_Schema.md) - MongoDB models reference.

---

## 🌟 Key Features

### 🎨 Premium Appearance System
*   **Dynamic Templates**: Choose from over 30+ handcrafted themes (Cyberpunk, Minimal, Glassmorphism).
*   **Deep Customization**: Fine-tune button shapes, shadows, fonts, and background layers (Blur, Overlay).
*   **Live Preview**: Real-time mobile preview that renders changes instantly.

### 📊 Advanced Analytics
*   **Insightful Charts**: Track views, clicks, and CTR with beautiful, interactive graphs.
*   **Device & Location Tracking**: Understand your audience demographics.
*   **Date Range Filtering**: Analyze performance over time.

### 💼 Pro & Monetization
*   **SaaS Architecture**: Built-in specialized "Pro" tier logic.
*   **Payments**: Integrated with **Razorpay** for seamless subscription handling.
*   **Premium Gating**: Lock specific themes and features behind subscription plans.

### 🛡️ Robust Backend
*   **SEO Optimized**: Server-Side Injection for dynamic `og:tags` on user profiles (Twitter/LinkedIn previews).
*   **Secure Auth**: Session-based authentication with `HTTPOnly` cookies and `MongoStore`.
*   **Admin Dashboard**: "God Mode" panel to manage users, payments, and system-wide settings.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: [TailwindCSS v4](https://tailwindcss.com/) + DaisyUI
*   **Routing**: React Router v7
*   **State**: Context API (`AuthContext`, `ThemeContext`)
*   **Animations**: Framer Motion & GSAP

### **Backend (Server)**
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js v5](https://expressjs.com/en/5x/api.html) (Beta)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Auth**: Express Session + Cookie Parser
*   **Payments**: Razorpay SDK
*   **Storage**: Cloudinary (Image Uploads)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas URI or Local MongoDB
*   Razorpay Account (for payments)
*   Cloudinary Account (for images)

### 1. Clone the Repository
```bash
git clone https://github.com/QuasimKhan/bunchly.git
cd bunchly
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_session_key
Client_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_key_id
```
Start the client:
```bash
npm run dev
```

### 4. Visit the App
Open [http://localhost:5173](http://localhost:5173) (or [bunchly.in](https://bunchly.in) in prod).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/QuasimKhan">Quasim Khan</a>
</p>
