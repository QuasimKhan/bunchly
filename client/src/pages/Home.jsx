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
