import AnimateOnScroll from "../AnimateOnScroll";

const CTA = () => {
    return (
        <section className="pt-24 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
            <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold">
                    Build your digital identity today
                </h2>

                <p className="mt-4 max-w-xl mx-auto opacity-90">
                    Join Bunchly and create a link page that actually represents
                    you.
                </p>

                <button className="mt-8 px-8 py-3 rounded-xl bg-white text-black font-semibold hover:scale-[1.05] transition">
                    Create Your Page
                </button>
            </AnimateOnScroll>
        </section>
    );
};

export default CTA;
