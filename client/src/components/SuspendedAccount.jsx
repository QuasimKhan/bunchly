import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const SuspendedAccount = ({ username }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-neutral-50 dark:bg-black">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-500 mb-6">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Account Suspended</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8">
                The account <strong>@{username}</strong> has been suspended for violating our terms of service or community guidelines.
            </p>
            <Link 
                to="/" 
                className="px-6 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-opacity"
            >
                Return to Home
            </Link>
        </div>
    );
};

export default SuspendedAccount;
