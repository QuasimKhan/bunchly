import AnimateOnScroll from "../AnimateOnScroll";

const Pricing = () => {
    return (
        <section className="pt-28 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <AnimateOnScroll>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Simple Pricing
                    </h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Start free. Upgrade only when you need more.
                    </p>
                </AnimateOnScroll>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PriceCard
                        plan="Free"
                        price="$0"
                        features={[
                            "Unlimited links",
                            "Basic themes",
                            "Limited analytics",
                        ]}
                    />

                    <PriceCard
                        highlight
                        plan="Pro"
                        price="$9/mo"
                        features={[
                            "Premium themes",
                            "Full analytics",
                            "Custom domain",
                        ]}
                    />

                    <PriceCard
                        plan="Business"
                        price="$29/mo"
                        features={[
                            "Multiple profiles",
                            "Team analytics",
                            "Priority support",
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

const PriceCard = ({ plan, price, features, highlight }) => (
    <AnimateOnScroll>
        <div
            className={`p-8 rounded-2xl border shadow-lg ${
                highlight
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-[1.03]"
                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            }`}
        >
            <h3 className="text-2xl font-bold">{plan}</h3>
            <p className="text-4xl font-extrabold mt-3">{price}</p>

            <ul className="mt-6 space-y-2 text-sm">
                {features.map((f) => (
                    <li key={f}>{f}</li>
                ))}
            </ul>

            <button
                className={`mt-8 w-full py-3 rounded-xl font-semibold transition ${
                    highlight
                        ? "bg-white text-black"
                        : "bg-indigo-600 text-white"
                }`}
            >
                Get Started
            </button>
        </div>
    </AnimateOnScroll>
);

export default Pricing;
