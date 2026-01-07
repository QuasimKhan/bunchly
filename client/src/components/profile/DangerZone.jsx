
import React from 'react';
import Button from '../ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DangerZone = ({ onDelete }) => {
    return (
        <section className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Danger Zone</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Irreversible account actions.</p>
                </div>
            </div>

            <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-200">Delete Account</h3>
                        <p className="text-sm text-red-700/80 dark:text-red-300/70 mt-1 max-w-md">
                            Once you delete your account, there is no going back. All your links, data, and settings will be permanently removed.
                        </p>
                    </div>
                    <Button 
                        text="Delete Account" 
                        variant="danger" 
                        icon={Trash2}
                        onClick={onDelete}
                        className="shrink-0 bg-red-600 hover:bg-red-700 text-white border-none shadow-red-200 dark:shadow-none"
                    />
                </div>
            </div>
        </section>
    );
};

export default DangerZone;
