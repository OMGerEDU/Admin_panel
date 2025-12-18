import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Building2, Users, Crown, Plus, ArrowRight } from 'lucide-react'

export default function OrganizationOverview() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orgs, setOrgs] = useState([])
  const [newOrgName, setNewOrgName] = useState('')

  useEffect(() => {
    fetchOrganizations()
  }, [user])

  const fetchOrganizations = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get organizations where the user is a member
      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id, organizations(id, name, owner_id, created_at)')
        .eq('user_id', user.id)

      if (error) throw error

      const seen = new Map()
      ;(data || []).forEach((row) => {
        const org = row.organizations
        if (org && !seen.has(org.id)) {
          seen.set(org.id, org)
        }
      })

      setOrgs(Array.from(seen.values()))
    } catch (err) {
      console.error('Error fetching organizations:', err)
      setOrgs([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrg = async (e) => {
    e.preventDefault()
    if (!user || !newOrgName.trim()) return

    try {
      setSaving(true)
      // Create organization
      const { data: org, error } = await supabase
        .from('organizations')
        .insert({
          name: newOrgName.trim(),
          owner_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Make sure owner is also a member (role admin)
      const { error: memberError } = await supabase.from('organization_members').insert({
        organization_id: org.id,
        user_id: user.id,
        role: 'admin',
      })

      if (memberError) {
        console.error('Error inserting owner as member:', memberError)
      }

      setNewOrgName('')
      await fetchOrganizations()
      navigate(`/app/organization/${org.id}`)
    } catch (err) {
      console.error('Error creating organization:', err)
      alert(err.message || 'Failed to create organization')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('error')}: Not authenticated
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('common.loading')}
      </div>
    )
  }

  const hasOrgs = orgs.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t('organization_settings') || 'Organization Settings'}
        </h2>
        <p className="text-muted-foreground">
          Manage your organizations, ownership and members.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {hasOrgs ? 'Your organizations' : 'No organizations yet'}
            </CardTitle>
            <CardDescription>
              {hasOrgs
                ? 'Select an organization to manage its settings and members.'
                : 'Create your first organization to start collaborating with your team.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hasOrgs ? (
              orgs.map((org) => {
                const isOwner = org.owner_id === user.id
                return (
                  <div
                    key={org.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{org.name}</span>
                        {isOwner && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <Crown className="mr-1 h-3 w-3" />
                            Owner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ID: {org.id.slice(0, 8)} ·{' '}
                        {new Date(org.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => navigate(`/app/organization/${org.id}`)}
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      {t('settings')}
                    </Button>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                You are not a member of any organization yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('create_org')}
            </CardTitle>
            <CardDescription>
              Create a new organization where you will be the owner and admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrg} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t('common.name')}
                </label>
                <Input
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder={t('create_org')}
                  required
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? t('common.loading') : t('create')}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                <Users className="mt-0.5 h-3 w-3" />
                <span>
                  To join an existing organization, ask an admin to invite you
                  by email or send you an invite link. New members are managed
                  from the organization settings page.
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


