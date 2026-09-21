import { useState } from 'react'
import type { FormEvent } from 'react'
import { createTask } from '../features/taskService'

interface TodoFormProps {
  userId: string
  onTaskCreated: () => void
}

function TodoForm({ userId, onTaskCreated }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }

    try {
      setLoading(true)
      setError('')

      await createTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        userId,
        createdAt: new Date(),
      })

      setTitle('')
      setDescription('')

      onTaskCreated()
    } catch (error) {
      console.error(error)
      setError('No fue posible crear la tarea.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ej: Estudiar React"
          required
        />
      </div>

      <div>
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe la tarea"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear tarea'}
      </button>

      {error && <p>{error}</p>}
    </form>
  )
}

export default TodoForm