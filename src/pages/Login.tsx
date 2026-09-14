import { useState } from 'react'
import type { FormEvent } from 'react'
import { loginUser } from '../features/authService'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await loginUser(email, password)
      alert('Inicio de sesión exitoso')
    } catch (error) {
  if (error instanceof Error) {
    setError(error.message)
  } else {
    setError('No fue posible iniciar sesión')
  }

  console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        {error && <p>{error}</p>}
      </form>
    </main>
  )
}

export default Login