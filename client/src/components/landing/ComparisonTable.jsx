import AnimateOnScroll from "../AnimateOnScroll";
import { Check, Minus } from "lucide-react";

const ComparisonTable = () => {
    return (
        <section className="pt-24 sm:pt-28 px-5 sm:px-6 bg-white dark:bg-black">
            <div className="max-w-5xl mx-auto">
                <AnimateOnScroll>
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12">
                        Why creators choose Bunchly
                    </h2>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.1}>
                    <div className="overflow-x-auto">
                        <table
                            className="
                                w-full
                                border border-gray-200 dark:border-gray-800
                                rounded-2xl
                                overflow-hidden
                                text-sm sm:text-base
                            "
                        >
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-5 py-4 text-left font-medium text-gray-600 dark:text-gray-400">
                                        Feature
                                    </th>
                                    <th className="px-5 py-4 text-center font-semibold text-indigo-600">
                                        Bunchly
                                    </th>
                                    <th className="px-5 py-4 text-center font-medium text-gray-600 dark:text-gray-400">
                                        Others
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    ["Unlimited links", true, false],
                                    ["Custom domains", true, false],
                                    ["Modern & clean UI", true, "limited"],
                                    ["Built-in analytics", true, "paid"],
                                    ["Brand control", true, false],
                                ].map(([feature, bunchly, others]) => (
                                    <tr
                                        key={feature}
                                        className="
                                            border-t border-gray-200 dark:border-gray-800
                                            hover:bg-gray-50 dark:hover:bg-gray-900/50
                                            transition
                                        "
                                    >
                                        <td className="px-5 py-4">{feature}</td>

                                        <td className="px-5 py-4 text-center">
                                            <Check className="inline w-5 h-5 text-indigo-600" />
                                        </td>

                                        <td className="px-5 py-4 text-center text-gray-500">
                                            {others === true ? (
                                                <Check className="inline w-5 h-5" />
                                            ) : others === "limited" ? (
                                                <span className="text-sm">
                                                    Limited
                                                </span>
                                            ) : others === "paid" ? (
                                                <span className="text-sm">
                                                    Paid
                                                </span>
                                            ) : (
                                                <Minus className="inline w-5 h-5" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.2}>
                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Comparison based on publicly available features.
                    </p>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default ComparisonTable;
