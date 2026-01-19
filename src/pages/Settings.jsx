import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Mail, Image, Bell, Lock, Sparkles, BookOpen } from 'lucide-react';

export default function Settings() {
    const { t } = useTranslation();
    const { user, updateProfile: updateGlobalProfile } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        avatar_url: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setProfile(data);
            setFormData({
                full_name: data.full_name || '',
                email: data.email || user.email || '',
                avatar_url: data.avatar_url || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    email: formData.email,
                    avatar_url: formData.avatar_url
                })
                .eq('id', user.id);

            if (error) throw error;
            alert(t('settings_page.profile_updated'));
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('settings')}</h2>
                <p className="text-muted-foreground">{t('settings_page.subtitle')}</p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('settings_page.profile')}
                    </CardTitle>
                    <CardDescription>{t('settings_page.general')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {t('settings_page.full_name')}
                            </label>
                            <Input
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder={t('settings_page.full_name')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {t('settings_page.email')}
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t('settings_page.email')}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                {t('settings_page.avatar_url')}
                            </label>
                            <Input
                                type="url"
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />
                            {formData.avatar_url && (
                                <img
                                    src={formData.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                        <Button type="submit" disabled={saving}>
                            {saving ? t('common.loading') : t('settings_page.update_profile')}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        {t('settings_page.notifications')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{t('settings_page.email_notifications')}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t('settings_page.email_notifications_desc')}
                                </p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        {t('settings_page.security')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t('settings_page.change_password_info')}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Beta Features */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5" />
                        Beta Features
                    </CardTitle>
                    <CardDescription>
                        Get early access to new features and help us test them.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-medium">Enable Beta Mode</p>
                                <p className="text-sm text-muted-foreground">
                                    You will see a 'BETA' badge and experimental features.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={profile?.is_beta_tester || false}
                                    onChange={async (e) => {
                                        const newValue = e.target.checked;
                                        // Optimistic update
                                        if (profile) {
                                            setProfile({ ...profile, is_beta_tester: newValue });
                                        }

                                        try {
                                            const { error } = await supabase
                                                .from('profiles')
                                                .update({ is_beta_tester: newValue })
                                                .eq('id', user.id);

                                            if (error) throw error;

                                            // Update local state
                                            if (profile) {
                                                setProfile({ ...profile, is_beta_tester: newValue });
                                            }
                                            // Update global context so Header badge updates immediately
                                            if (updateGlobalProfile) {
                                                updateGlobalProfile({ is_beta_tester: newValue });
                                            }
                                        } catch (err) {
                                            console.error('Error updating beta status:', err);
                                            // Revert
                                            fetchProfile();
                                        }
                                    }}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {profile?.is_beta_tester && (
                            <div className="pt-4 border-t border-primary/10">
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Documentation
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Access exclusive documentation and guides for beta features.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                    onClick={() => window.location.href = '/app/settings/documentation'}
                                >
                                    View Beta Documentation
                                </Button>
                            </div>
                        )}
                    </CardContent>
            </Card>
        </div>
    );
}
