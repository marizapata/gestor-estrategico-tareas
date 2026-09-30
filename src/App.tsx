import { Routes, Route, Link } from 'react-router-dom'
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
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            Gestor
          </Link>

          <nav className="main-nav">
            <Link to="/">Inicio</Link>

            {user && <Link to="/tareas">Tareas</Link>}

            {!user && (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/registro">Registrarse</Link>
              </>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="logout-button"
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

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