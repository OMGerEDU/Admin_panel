import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function OrganizationSettings() {
    const { orgId } = useParams();
    const [org, setOrg] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        fetchOrgDetails();
    }, [orgId]);

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

            // Fetch Members
            const { data: membersData, error: membersError } = await supabase
                .from('organization_members')
                .select(`
                    id,
                    role,
                    joined_at,
                    profiles:user_id (email, full_name, avatar_url)
                `)
                .eq('organization_id', orgId);

            if (membersError) throw membersError;
            setMembers(membersData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        alert("Invite feature technically requires an Edge Function to lookup user ID by email or send email invite. \n\nFor now, you can add an existing user if you know their UUID, or we need to implement the backend logic.");
        // Placeholder for logic:
        // 1. Lookup user by email (admin only usually, or requires specific RPC)
        // 2. Insert into organization_members
    };

    if (loading) return <div>Loading...</div>;
    if (!org) return <div>Organization not found</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <Link to="/">Back to Dashboard</Link>
            <div style={{ marginTop: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
                <h1>{org.name} Settings</h1>
                <p>ID: {org.id}</p>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>Members</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {members.map(member => (
                        <li key={member.id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>{member.profiles?.email || 'Unknown'}</strong> ({member.role})
                            </div>
                            <div>
                                {new Date(member.joined_at).toLocaleDateString()}
                            </div>
                        </li>
                    ))}
                </ul>

                <div style={{ marginTop: '2rem' }}>
                    <h3>Invite Member</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                        To invite a user, they must already be signed up. Enter their email below.
                        <br />
                        <em className="text-xs text-orange-600">Note: In this demo, we can't look up user IDs by email without a backend function. This step assumes you have the mechanism or manual entry.</em>
                    </p>
                    <form onSubmit={handleInvite} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder="User Email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            style={{ padding: '0.5rem', flexGrow: 1 }}
                        />
                        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}>Invite</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
