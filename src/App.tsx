import { Routes, Route } from 'react-router-dom'
import './firebase/config'
import { useAuth } from './hooks/useAuth'
import { logoutUser } from './features/authService'
import ProtectedRoute from './routes/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'

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
        {user
          ? `Usuario conectado: ${user.email}`
          : 'No hay usuario conectado'}
      </p>

      {user && (
        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Register />} />

        <Route
          path="/tareas"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App