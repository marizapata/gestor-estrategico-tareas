import { useState } from 'react'
import type { FormEvent } from 'react'
import { registerUser } from '../features/authService'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      await registerUser(email, password)
      alert('Cuenta creada correctamente')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('No fue posible crear la cuenta')
      }

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
            placeholder="Ej: correo@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Crea una contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          </button>
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirmar contraseña
          </label>

          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword
              ? 'Ocultar contraseña'
              : 'Mostrar contraseña'}
          </button>
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