import { Routes, Route } from 'react-router-dom'
import './firebase/config'
import { useAuth } from './hooks/useAuth'
import { logoutUser } from './features/authService'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const { user, loading } = useAuth()

  async function handleLogout() {
  try {
    await logoutUser()
  } catch (error) {
    console.error(error)
  }
}

  if (loading) {
    return <p>Cargando sesión...</p>
  }

  return (
  <>
    <p>
      {user ? `Usuario conectado: ${user.email}` : 'No hay usuario conectado'}
    </p>

    {user && (
      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    )}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
    </Routes>
  </>
)
}

export default App