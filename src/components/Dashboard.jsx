import { useState } from 'react'
import '../styles/Dashboard.css'
import UsersManagement from './UsersManagement'
import AccountsManagement from './AccountsManagement'
import Settings from './Settings'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Builders Admin Panel</h1>
        </div>
        <div className="header-right">
          <span className="user-info">שלום, {user?.username || 'משתמש'}</span>
          <button onClick={onLogout} className="logout-button">
            התנתק
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          ניהול משתמשים
        </button>
        <button
          className={activeTab === 'accounts' ? 'active' : ''}
          onClick={() => setActiveTab('accounts')}
        >
          ניהול חשבונות
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          הגדרות
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'accounts' && <AccountsManagement />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default Dashboard

