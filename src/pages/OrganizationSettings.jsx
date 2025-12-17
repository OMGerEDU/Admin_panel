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
    const [invites, setInvites] = useState([]);
    const [creatingInvite, setCreatingInvite] = useState(false);

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

            // Fetch pending invites for this organization
            const { data: invitesData, error: invitesError } = await supabase
                .from('organization_invites')
                .select('*')
                .eq('organization_id', orgId)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (invitesError) throw invitesError;
            setInvites(invitesData || []);

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

    const createInviteLink = async () => {
        if (!isAdmin || !orgId) return;

        try {
            setCreatingInvite(true);
            const token = (window.crypto && window.crypto.randomUUID)
                ? window.crypto.randomUUID()
                : Math.random().toString(36).slice(2) + Date.now().toString(36);

            const { data, error } = await supabase
                .from('organization_invites')
                .insert({
                    organization_id: orgId,
                    token,
                    email: inviteEmail || null,
                    // Optional: set a 7-day expiry
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            const link = `${window.location.origin}/signup?invite=${data.token}`;
            await navigator.clipboard?.writeText(link);
            alert('Invite link created and copied to clipboard.');

            // Refresh invites list
            fetchOrgDetails();
        } catch (error) {
            console.error('Error creating invite link:', error);
            alert(error.message || 'Failed to create invite link');
        } finally {
            setCreatingInvite(false);
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
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Invite Member (email)
                            </CardTitle>
                            <CardDescription>
                                Add a member to this organization. The user must already have an account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleInvite} className="flex flex-col gap-2 sm:flex-row">
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
                                Note: The user must already be registered. Enter their email address to add them directly.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Invite Links</CardTitle>
                            <CardDescription>
                                Generate shareable links so new users can sign up and automatically join this organization.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    type="email"
                                    placeholder="Optional: invitee email (for reference only)"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={createInviteLink} disabled={creatingInvite}>
                                    {creatingInvite ? t('common.loading') : 'Create Invite Link'}
                                </Button>
                            </div>
                            {invites.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Active invite links
                                    </p>
                                    <div className="space-y-2">
                                        {invites.map((invite) => {
                                            const link = `${window.location.origin}/signup?invite=${invite.token}`;
                                            return (
                                                <div
                                                    key={invite.id}
                                                    className="flex flex-col gap-1 rounded border p-2 text-xs sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="font-medium break-all">{link}</div>
                                                        <div className="text-muted-foreground">
                                                            {invite.email || 'Any email'} ·{' '}
                                                            {invite.expires_at
                                                                ? `Expires ${new Date(invite.expires_at).toLocaleDateString()}`
                                                                : 'No expiry'}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-1 sm:mt-0 sm:flex-none">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={async () => {
                                                                await navigator.clipboard?.writeText(link);
                                                                alert('Invite link copied to clipboard.');
                                                            }}
                                                        >
                                                            Copy
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
