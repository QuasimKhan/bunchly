import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Privacy = () => {
    return (
        <div className="bg-neutral-50 dark:bg-neutral-950">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-20">
                {/* ================= HEADER ================= */}
                <header className="mb-14 text-center">
                    <div className="inline-flex items-center justify-center mb-4">
                        <img
                            src="/img/Bunchly-dark.png"
                            className="h-8 md:h-10 hidden dark:block"
                            alt="logo"
                        />
                        <img
                            src="/img/Bunchly-light.png"
                            className="h-8 md:h-10 dark:hidden"
                            alt="logo"
                        />
                    </div>

                    <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                        Privacy Policy
                    </h1>

                    <p className="mt-3 text-sm text-neutral-500">
                        Last updated: {new Date().toDateString()}
                    </p>
                </header>

                {/* ================= CONTENT ================= */}
                <div className="space-y-8 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    <PolicyCard title="Introduction">
                        <p>
                            Bunchly ("we", "our", or "us") respects your privacy
                            and is committed to protecting your personal
                            information. This Privacy Policy explains how we
                            collect, use, and protect your data when you use our
                            platform.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Information We Collect">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Account Information:</strong> Name,
                                email, username, profile image, bio.
                            </li>
                            <li>
                                <strong>Authentication Data:</strong> Login
                                method (email/password or Google OAuth).
                            </li>
                            <li>
                                <strong>Payment Information:</strong>
                                Subscription status, invoice numbers, payment
                                IDs. We do not store card details.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> Page views, clicks,
                                and interaction data.
                            </li>
                        </ul>
                    </PolicyCard>

                    <PolicyCard title="How We Use Your Information">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To create and manage your account</li>
                            <li>To provide core platform functionality</li>
                            <li>To process subscriptions and invoices</li>
                            <li>To improve product performance</li>
                            <li>To protect against abuse and fraud</li>
                        </ul>
                    </PolicyCard>

                    <PolicyCard title="Public Profiles">
                        <p>
                            Your public Bunchly profile (for example
                            <code className="mx-1 px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-xs">
                                /u/username
                            </code>
                            ) is publicly accessible. You control what
                            information appears on your public page.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Cookies & Tracking">
                        <p>
                            We use essential cookies required for the operation
                            of Bunchly and optional cookies for analytics. You
                            may accept or reject optional cookies through our
                            cookie consent banner.
                        </p>
                        <p className="mt-2">
                            Essential cookies are always enabled to ensure core
                            functionality.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Payments">
                        <p>
                            Payments are processed securely by trusted
                            third-party providers (such as Razorpay). Bunchly
                            does not store your card or banking information.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Data Sharing">
                        <p>
                            We do not sell your personal data. Information is
                            shared only with services required to operate
                            Bunchly, such as authentication, payments, and
                            analytics.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Data Security">
                        <p>
                            We use industry-standard safeguards to protect your
                            data. While we strive to protect your information,
                            no system can be guaranteed 100% secure.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Your Rights">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Access and update your account data</li>
                            <li>Download invoices and billing history</li>
                            <li>Permanently delete your account</li>
                        </ul>
                    </PolicyCard>

                    <PolicyCard title="Data Retention">
                        <p>
                            We retain personal data only for as long as
                            necessary to provide services or meet legal
                            obligations. You may delete your account at any
                            time.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Changes to This Policy">
                        <p>
                            We may update this Privacy Policy occasionally.
                            Material changes will be communicated clearly.
                        </p>
                    </PolicyCard>

                    <PolicyCard title="Contact Us">
                        <p>
                            If you have questions about this Privacy Policy,
                            contact us at:
                        </p>
                        <p className="mt-2 font-medium text-neutral-900 dark:text-white">
                            bunchly.contact@gmail.com
                        </p>
                    </PolicyCard>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Privacy;

/* ================= REUSABLE CARD ================= */

const PolicyCard = ({ title, children }) => (
    <section
        className="
            rounded-2xl
            border border-neutral-200 dark:border-neutral-800
            bg-white dark:bg-neutral-900
            p-6
        "
    >
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-3">
            {title}
        </h2>
        {children}
    </section>
);
