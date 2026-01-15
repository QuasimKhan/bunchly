import React from "react";

const AdminDashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse pb-10">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                    <div className="h-4 w-32 bg-neutral-200 dark:bg-white/5 rounded-full"></div>
                    <div className="h-10 w-64 md:w-96 bg-neutral-200 dark:bg-white/5 rounded-2xl"></div>
                    <div className="h-4 w-48 bg-neutral-200 dark:bg-white/5 rounded-full"></div>
                </div>
                <div className="flex gap-3">
                    <div className="hidden md:block w-40 h-10 bg-neutral-200 dark:bg-white/5 rounded-xl"></div>
                    <div className="w-10 h-10 bg-neutral-200 dark:bg-white/5 rounded-xl"></div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-neutral-200 dark:border-white/5 h-40">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-neutral-200 dark:bg-white/5 rounded-2xl"></div>
                            <div className="w-16 h-6 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                        </div>
                        <div className="space-y-2">
                             <div className="h-8 w-24 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                             <div className="h-4 w-32 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-8 border border-neutral-200 dark:border-white/5 h-[400px]">
                     <div className="flex justify-between mb-8">
                        <div className="space-y-2">
                            <div className="h-6 w-32 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                            <div className="h-4 w-48 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                        </div>
                         <div className="w-10 h-10 bg-neutral-200 dark:bg-white/5 rounded-xl"></div>
                     </div>
                     <div className="h-[280px] w-full bg-neutral-100 dark:bg-white/[0.02] rounded-2xl"></div>
                </div>
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-8 border border-neutral-200 dark:border-white/5 h-[400px]">
                    <div className="flex justify-between mb-8">
                        <div className="space-y-2">
                            <div className="h-6 w-32 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                            <div className="h-4 w-48 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                        </div>
                         <div className="w-10 h-10 bg-neutral-200 dark:bg-white/5 rounded-xl"></div>
                     </div>
                     <div className="h-[280px] w-full bg-neutral-100 dark:bg-white/[0.02] rounded-2xl"></div>
                </div>
            </div>

            {/* Tables Skeleton */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-[#121212] rounded-[2rem] border border-neutral-200 dark:border-white/5 h-[400px] p-6">
                    <div className="flex justify-between mb-6">
                         <div className="h-6 w-40 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                         <div className="h-8 w-24 bg-neutral-200 dark:bg-white/5 rounded-lg"></div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                             <div key={i} className="h-16 w-full bg-neutral-100 dark:bg-white/[0.02] rounded-xl"></div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-neutral-200 dark:border-white/5 h-[400px] p-6">
                    <div className="h-6 w-40 bg-neutral-200 dark:bg-white/5 rounded-lg mb-6"></div>
                     <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                             <div key={i} className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-white/5"></div>
                                  <div className="flex-1 space-y-2">
                                       <div className="h-3 w-full bg-neutral-200 dark:bg-white/5 rounded"></div>
                                       <div className="h-3 w-2/3 bg-neutral-200 dark:bg-white/5 rounded"></div>
                                  </div>
                             </div>
                        ))}
                    </div>
                </div>
             </div>
        </div>
    );
};

export default AdminDashboardSkeleton;
