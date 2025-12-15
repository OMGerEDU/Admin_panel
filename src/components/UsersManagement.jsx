import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../services/api'
import '../styles/UsersManagement.css'

function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    
    const result = await getUsers()
    
    if (result.success) {
      // Assuming the API returns { users: [...] } or direct array
      const usersList = result.data?.users || result.data || []
      setUsers(Array.isArray(usersList) ? usersList : [])
    } else {
      setError('שגיאה בטעינת משתמשים: ' + result.error)
    }
    
    setLoading(false)
  }

  const handleAddUser = async (userData) => {
    const result = await createUser(userData)
    
    if (result.success) {
      setShowAddModal(false)
      loadUsers()
    } else {
      setError('שגיאה ביצירת משתמש: ' + result.error)
    }
  }

  const handleUpdateUser = async (userId, userData) => {
    const result = await updateUser(userId, userData)
    
    if (result.success) {
      setEditingUser(null)
      loadUsers()
    } else {
      setError('שגיאה בעדכון משתמש: ' + result.error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
      return
    }

    const result = await deleteUser(userId)
    
    if (result.success) {
      loadUsers()
    } else {
      setError('שגיאה במחיקת משתמש: ' + result.error)
    }
  }

  return (
    <div className="users-management">
      <div className="section-header">
        <h2>ניהול משתמשים</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          + הוסף משתמש
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">טוען משתמשים...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>שם משתמש</th>
                <th>סטטוס</th>
                <th>חשבונות</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    אין משתמשים
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id || user.userId}>
                    <td>{user.username}</td>
                    <td>
                      <span className={`status ${user.active ? 'active' : 'inactive'}`}>
                        {user.active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td>{user.accounts?.length || 0} חשבונות</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => setEditingUser(user)}
                      >
                        ערוך
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id || user.userId)}
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <UserModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      )}

      {editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(userData) => handleUpdateUser(editingUser.id || editingUser.userId, userData)}
        />
      )}
    </div>
  )
}

function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: '',
    active: user?.active !== undefined ? user.active : true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{user ? 'ערוך משתמש' : 'הוסף משתמש'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>שם משתמש</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          {!user && (
            <div className="form-group">
              <label>סיסמה</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!user}
              />
            </div>
          )}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              משתמש פעיל
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              ביטול
            </button>
            <button type="submit">שמור</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UsersManagement

