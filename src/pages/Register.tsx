import { useState } from 'react'
import type { FormEvent } from 'react'
import { registerUser } from '../features/authService'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await registerUser(email, password)
      alert('Cuenta creada correctamente')
    } catch (error) {
      setError('No fue posible crear la cuenta')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Crear una cuenta</h1>

      <form onSubmit={handleRegister}>
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
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        {error && <p>{error}</p>}
      </form>
    </main>
  )
}

export default Register