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
    useSEO({
        title: "Bunchly – One Link. Every Identity.",
        description:
            "One link to represent your entire digital identity. Built for creators, professionals, and brands.",
        image: "/og-image.png",
        url: buildUrl("/"),
    });

    return (
        <>
            <SaleBanner className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] max-w-5xl rounded-xl shadow-xl z-40 !overflow-visible backdrop-blur-md bg-indigo-600/95" />
            <Navbar />
            <Hero />
            <SocialProof />
            <Features />
            <LandingPreview />
            <ComparisonTable />
            <UseCases />
            <Pricing />
            <CTA />
            <Footer />
        </>
    );
};

export default Home;
