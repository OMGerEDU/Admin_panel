// API Base URL
// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://n8n-railway-custom-production-1086.up.railway.app'

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE_URL}${endpoint}`

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('API Error:', error)
    return { success: false, error: error.message }
  }
}

// Authentication
export async function login(username, password) {
  return apiCall('/webhook/73539861-4649-4b44-ac5b-62a60677a9b8', 'POST', {
    action: 'verifyUser',
    username,
    password,
  })
}

// Users Management
export async function getUsers() {
  return apiCall('/webhook/getUsers', 'POST', {
    action: 'getUsers',
  })
}

export async function createUser(userData) {
  return apiCall('/webhook/createUser', 'POST', {
    action: 'createUser',
    ...userData,
  })
}

export async function updateUser(userId, userData) {
  return apiCall('/webhook/updateUser', 'POST', {
    action: 'updateUser',
    userId,
    ...userData,
  })
}

export async function deleteUser(userId) {
  return apiCall('/webhook/deleteUser', 'POST', {
    action: 'deleteUser',
    userId,
  })
}

// Accounts Management
export async function getUserAccounts(userId) {
  return apiCall('/webhook/getUserAccounts', 'POST', {
    action: 'getUserAccounts',
    userId,
  })
}

export async function addAccount(userId, accountData) {
  return apiCall('/webhook/addAccount', 'POST', {
    action: 'addAccount',
    userId,
    ...accountData,
  })
}

export async function updateAccount(userId, accountId, accountData) {
  return apiCall('/webhook/updateAccount', 'POST', {
    action: 'updateAccount',
    userId,
    accountId,
    ...accountData,
  })
}

export async function deleteAccount(userId, accountId) {
  return apiCall('/webhook/deleteAccount', 'POST', {
    action: 'deleteAccount',
    userId,
    accountId,
  })
}

