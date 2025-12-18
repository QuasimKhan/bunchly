import AnimateOnScroll from "../AnimateOnScroll";

const UseCases = () => (
    <section className="py-28 max-w-6xl mx-auto px-6">
        <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center mb-12">
                Built for every kind of creator
            </h2>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
            <UseCard
                title="Creators"
                desc="Instagram, YouTube, TikTok links in one place."
            />
            <UseCard
                title="Developers"
                desc="GitHub, portfolio, resume, socials."
            />
            <UseCard
                title="Businesses"
                desc="Landing pages, offers, contact links."
            />
        </div>
    </section>
);

const UseCard = ({ title, desc }) => (
    <AnimateOnScroll>
        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{desc}</p>
        </div>
    </AnimateOnScroll>
);

export default UseCases;
