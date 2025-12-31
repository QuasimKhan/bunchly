import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import Button from "./ui/Button";

const PublicProfileNotFound = ({ username }) => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden
            bg-linear-to-br
            from-[#f5f7ff] via-[#eef1ff] to-[#e9ecff]
            dark:from-[#0b0d14] dark:via-[#0e1018] dark:to-[#12131d]"
        >
            {/* Ambient Brand Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[140px]" />

            {/* Glass Card */}
            <div
                className="relative z-10 w-full max-w-md text-center
                backdrop-blur-2xl
                bg-white/70 dark:bg-white/10
                border border-black/5 dark:border-white/10
                rounded-3xl p-10
                shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]
                dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
            >
                {/* Brand */}
                <img
                    src="/img/Bunchly-light.png"
                    alt="Bunchly"
                    className="mx-auto mb-6 w-28 dark:hidden"
                />
                <img
                    src="/img/Bunchly-dark.png"
                    alt="Bunchly"
                    className="mx-auto mb-6 w-28 hidden dark:block"
                />

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                    @{username} isn’t on Bunchly yet
                </h1>

                {/* Description */}
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    This username is currently available. Create your own page
                    and start sharing all your links in one clean, professional
                    profile.
                </p>

                {/* CTA */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    <Button
                        text={`Claim @${username}`}
                        icon={UserPlus}
                        onClick={() =>
                            navigate("/signup", {
                                state: { suggestedUsername: username },
                            })
                        }
                    />

                    <Link
                        to="/"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Learn more about Bunchly
                    </Link>
                </div>

                {/* Footer Branding */}
                <p className="mt-10 text-xs text-neutral-500">
                    Build your digital identity with Bunchly
                </p>
            </div>
        </div>
    );
};

export default PublicProfileNotFound;
