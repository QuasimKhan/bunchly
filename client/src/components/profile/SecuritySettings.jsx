
import React from 'react';
import Button from '../ui/Button';
import { Shield, Key, Lock, Smartphone } from 'lucide-react';

const SecuritySettings = ({ onChangePassword }) => {
    return (
        <section className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Security & Access</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your password and security preferences.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                
                {/* Password Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 shrink-0">
                            <Key className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-white">Password</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Last changed directly via update. Secure your account with a strong password.
                            </p>
                        </div>
                    </div>
                    <Button 
                        text="Change Password" 
                        variant="secondary" 
                        onClick={onChangePassword}
                        className="shrink-0"
                    />
                </div>

                {/* 2FA Placeholder (Premium Fake) */}
                <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-70 grayscale pointer-events-none select-none">
                     <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 shrink-0">
                            <Smartphone className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                2-Factor Authentication 
                                <span className="text-[10px] uppercase bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-bold">Soon</span>
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Add an extra layer of security to your account.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 relative">
                             <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SecuritySettings;
