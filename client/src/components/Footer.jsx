import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    {/* Branding */}
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            <Link
                                to="/"
                                className="flex items-center gap-2 active:scale-95 transition"
                            >
                                <img
                                    src="/img/Bunchly-dark.png"
                                    className="h-6 md:h-10 hidden dark:block"
                                    alt="logo"
                                />
                                <img
                                    src="/img/Bunchly-light.png"
                                    className="h-6 md:h-10 dark:hidden"
                                    alt="logo"
                                />
                            </Link>
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500 max-w-sm">
                            One Link. Every Identity.
                        </p>
                    </div>

                    {/* Minimal Links */}
                    <div className="flex gap-4 text-sm text-neutral-500">
                        <FooterLink href="/privacy" label="Privacy" />
                        <FooterLink href="/terms" label="Terms" />
                    </div>
                </div>

                {/* Copyright */}
                <p className="mt-8 text-xs text-neutral-400">
                    © {new Date().getFullYear()} Bunchly. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

const FooterLink = ({ href, label }) => (
    <a
        href={href}
        className="hover:text-neutral-900 dark:hover:text-white transition"
    >
        {label}
    </a>
);

export default Footer;
