# ⚡ Bunchly

**The Ultimate Premium "Link in Bio" SaaS Platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-MERN-blue?logo=react)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green)]()

**Bunchly** is a high-performance, aesthetically pleasing, and feature-rich clone of platforms like Linktree. Built for creators, influencers, and professionals, it offers deep customization, real-time analytics, and seamless payment integrations in a "God Mode" SaaS experience.

![Bunchly Preview](https://via.placeholder.com/1200x600?text=Bunchly+Dashboard+Preview)

---

## 🌟 Key Features

### 🎨 Premium Appearance System
*   **Dynamic Templates**: Choose from over 30+ handcrafted themes (Cyberpunk, Minimal, Glassmorphism, Brutalist).
*   **Deep Customization**: Fine-tune button shapes (Pill, Rounded, Sharp), shadows, fonts, and background layers (Blur, Overlay).
*   **Live Preview**: Real-time mobile preview that renders changes instantly as you edit.

### 📊 Advanced Analytics
*   **Insightful Charts**: Track views, clicks, and CTR with beautiful, interactive graphs.
*   **Device & Location Tracking**: Understand your audience demographics.
*   **Date Range Filtering**: Analyze performance over time.

### 💼 Pro & Monetization
*   **SaaS Architecture**: Built-in specialized "Pro" tier logic.
*   **Payment Gateway**: Integrated with **Razorpay** for seamless subscription handling.
*   **Premium Gating**: Lock specific themes, analytics, and features behind subscription plans.

### 🛡️ Robust Backend
*   **SEO Optimized**: Automatic `sitemap.xml` generation for user profiles and `robots.txt` configuration for Google Search Console.
*   **Secure Auth**: JWT-based authentication with session management and HTTP-only cookies.
*   **Admin Dashboard**: Powerful "God Mode" admin panel to manage users, payments, and system-wide settings.

---

## 🛠️ Tech Stack

### **Frontend**
*   **Framework**: [React](https://reactjs.org/) (Vite)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) + Custom CSS Variables
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **State**: Context API
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)

### **Backend**
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
*   **Auth**: JWT (JSON Web Tokens)
*   **Payments**: Razorpay SDK

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas URI or Local MongoDB
*   Razorpay Account (for payments)

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
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
Client_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
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
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_key_id
```
Start the client:
```bash
npm run dev
```

### 4. Visit the App
Open [http://localhost:5173](http://localhost:5173) to view the application.

---

## 🌍 SEO & Deployment

Bunchly comes pre-configured for deployment on platforms like **Netlify** (Frontend) and **AWS/Render** (Backend).

*   **Sitemap**: Automatically generated at `/api/sitemap.xml`.
*   **Robots.txt**: Configured to proxy the sitemap for maximum crawlability.

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
