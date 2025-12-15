import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowLeft, UserPlus, Trash2, Crown, User } from 'lucide-react';

export default function OrganizationSettings() {
    const { orgId } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [org, setOrg] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchOrgDetails();
    }, [orgId, user]);

    const fetchOrgDetails = async () => {
        try {
            setLoading(true);
            // Fetch Org
            const { data: orgData, error: orgError } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', orgId)
                .single();
            if (orgError) throw orgError;
            setOrg(orgData);

            // Check if user is admin
            const { data: memberData } = await supabase
                .from('organization_members')
                .select('role')
                .eq('organization_id', orgId)
                .eq('user_id', user?.id)
                .single();
            
            setIsAdmin(memberData?.role === 'admin' || orgData.owner_id === user?.id);

            // Fetch Members
            const { data: membersData, error: membersError } = await supabase
                .from('organization_members')
                .select(`
                    id,
                    role,
                    joined_at,
                    profiles:user_id (id, email, full_name, avatar_url)
                `)
                .eq('organization_id', orgId)
                .order('joined_at', { ascending: false });

            if (membersError) throw membersError;
            setMembers(membersData || []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail || !isAdmin) return;

        try {
            setInviting(true);
            // Lookup user by email from profiles
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', inviteEmail)
                .single();

            if (profileError || !profileData) {
                alert('User not found. Please make sure the user has signed up first.');
                return;
            }

            // Check if user is already a member
            const { data: existingMember } = await supabase
                .from('organization_members')
                .select('id')
                .eq('organization_id', orgId)
                .eq('user_id', profileData.id)
                .single();

            if (existingMember) {
                alert('User is already a member of this organization.');
                return;
            }

            // Add user to organization
            const { error: insertError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: orgId,
                    user_id: profileData.id,
                    role: 'member'
                });

            if (insertError) throw insertError;

            alert('Member added successfully!');
            setInviteEmail('');
            fetchOrgDetails();
        } catch (error) {
            console.error('Error inviting member:', error);
            alert(error.message || 'Failed to add member');
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveMember = async (memberId, memberUserId) => {
        if (!isAdmin) return;
        if (!confirm('Are you sure you want to remove this member?')) return;

        // Prevent removing the owner
        if (org?.owner_id === memberUserId) {
            alert('Cannot remove the organization owner');
            return;
        }

        try {
            const { error } = await supabase
                .from('organization_members')
                .delete()
                .eq('id', memberId);

            if (error) throw error;
            fetchOrgDetails();
        } catch (error) {
            console.error('Error removing member:', error);
            alert(error.message);
        }
    };

    if (loading) return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>;
    if (!org) return <div className="text-center py-8">{t('error')}: Organization not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{org.name} {t('settings')}</h2>
                    <p className="text-muted-foreground">Organization ID: {org.id.slice(0, 8)}...</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('settings_page.profile')}
                    </CardTitle>
                    <CardDescription>{t('settings_page.general')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">{t('common.name')}</p>
                        <p className="text-lg">{org.name}</p>
                        <p className="text-sm font-medium mt-4">{t('common.date')}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(org.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>Manage organization members</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.name')}</TableHead>
                                <TableHead>{t('login.email')}</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>{t('common.date')}</TableHead>
                                {isAdmin && <TableHead className="text-right">{t('common.actions')}</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {member.role === 'admin' || org.owner_id === member.profiles?.id ? (
                                                <Crown className="h-4 w-4 text-yellow-500" />
                                            ) : (
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            {member.profiles?.full_name || member.profiles?.email || 'Unknown'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.profiles?.email || '-'}</TableCell>
                                    <TableCell>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            member.role === 'admin' || org.owner_id === member.profiles?.id
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                : 'bg-muted'
                                        }`}>
                                            {org.owner_id === member.profiles?.id ? 'Owner' : member.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(member.joined_at).toLocaleDateString()}
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            {org.owner_id !== member.profiles?.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveMember(member.id, member.profiles?.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Invite Member
                        </CardTitle>
                        <CardDescription>
                            Add a member to this organization. The user must already have an account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="flex gap-2">
                            <Input
                                type="email"
                                placeholder={t('login.email')}
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                required
                                className="flex-1"
                            />
                            <Button type="submit" disabled={inviting}>
                                {inviting ? t('common.loading') : 'Invite'}
                            </Button>
                        </form>
                        <p className="text-xs text-muted-foreground mt-2">
                            Note: The user must already be registered. Enter their email address to add them.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
