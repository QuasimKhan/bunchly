
import React from 'react';
import EditProfileField from './EditProfileField';
import { User, AtSign, AlignLeft, Mail, Shield } from 'lucide-react';

const PersonalInfo = ({ user, onEdit }) => {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Personal Information</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your public identity and details.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditProfileField
                    icon={User}
                    label="Display Name"
                    value={user.name}
                    onEdit={() => onEdit("name")}
                />
                
                <EditProfileField
                    icon={AtSign}
                    label="Username"
                    value={user.username}
                    onEdit={() => onEdit("username")}
                />

                <EditProfileField
                    icon={Mail}
                    label="Email Address"
                    value={user.email}
                    editable={user.authProvider === "email"}
                    onEdit={() => user.authProvider === "email" && onEdit("email")}
                    helperText={user.authProvider !== "email" ? `Managed by ${user.authProvider}` : ""}
                />

                <div className="md:col-span-2">
                    <EditProfileField
                        icon={AlignLeft}
                        label="Bio"
                        value={user.bio}
                        onEdit={() => onEdit("bio")}
                        fullWidth
                    />
                </div>

                <div className="md:col-span-2">
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between transition-colors">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${user.flags?.strikes > 0 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500' : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500'}`}>
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Account Standing</p>
                                <p className={`font-semibold ${user.flags?.strikes > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                                    {user.flags?.strikes > 0 ? `Warning (${user.flags.strikes}/3 Strikes)` : "Good Standing"}
                                </p>
                            </div>
                        </div>
                        {user.flags?.strikes > 0 && (
                            <div className="hidden sm:block text-xs text-amber-600 dark:text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/30">
                                3 Strikes = Permanent Ban
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonalInfo;
