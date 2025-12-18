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

const Home = () => {
    useSEO({
        title: "Bunchly – One Link for Your Digital Identity",
        description:
            "A premium bio-link platform for creators, professionals, and brands.",
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
