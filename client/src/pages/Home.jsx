import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../components/landing/Hero";
import SocialProof from "../components/landing/SocialProof";
import Features from "../components/landing/Features";
import LandingPreview from "../components/landing/LandingPreview";
import ComparisonTable from "../components/landing/ComparisonTable";
import UseCases from "../components/landing/UseCases";
import Pricing from "../components/landing/Pricing";
import CTA from "../components/landing/CTA";

import { useSEO } from "../hooks/useSEO";
import { buildUrl } from "../lib/seo";

import SaleBanner from "../components/SaleBanner";

const Home = () => {
    const [isBannerVisible, setIsBannerVisible] = useState(false);

    useSEO({
        title: "Bunchly – One Link. Every Identity.",
        description:
            "One link to represent your entire digital identity. Built for creators, professionals, and brands.",
        image: "/og-image.png",
        url: buildUrl("/"),
    });

    return (
        <>
            <SaleBanner 
                className="z-[100]" // High z-index to stay on top
                onStatusChange={setIsBannerVisible} 
            />
            
            {/* 
                Shift Navbar down if banner is visible. 
                Default top is top-6 (24px). If banner is present (~50px), add 50px offset.
            */}
            <Navbar style={{ top: isBannerVisible ? 'calc(1.5rem + 48px)' : '1.5rem' }} />
            
            {/* Shift Page Content if banner is visible to prevent overlap */}
            <div style={{ paddingTop: isBannerVisible ? '48px' : '0', transition: 'padding-top 0.3s ease' }}>
                <Hero />
                <SocialProof />
                <Features />
                <LandingPreview />
                <ComparisonTable />
                <UseCases />
                <Pricing />
                <CTA />
                <Footer />
            </div>
        </>
    );
};

export default Home;
