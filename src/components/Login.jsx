import { useState } from 'react'
import { login } from '../services/api'
import '../styles/Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)

    if (result.success && result.data) {
      const { data } = result
      
      // Check if user is authenticated
      if ((data.exists === true || data.success === true) && data.active === true) {
        onLogin({
          username: data.username || username,
          userId: data.userId,
          ...data,
        })
      } else if (data.exists === false) {
        setError('משתמש לא נמצא במערכת')
      } else if (data.active === false) {
        setError('המשתמש לא פעיל')
      } else {
        setError('פרטים לא תקינים')
      }
    } else {
      setError(result.error || 'שגיאה בהתחברות')
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Builders</h1>
          <p>Admin Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">שם משתמש</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="הכנס שם משתמש"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="הכנס סיסמה"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

