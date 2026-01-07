
import React from 'react';
import EditProfileField from './EditProfileField';
import { User, AtSign, AlignLeft, Mail } from 'lucide-react';

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
            </div>
        </section>
    );
};

export default PersonalInfo;
