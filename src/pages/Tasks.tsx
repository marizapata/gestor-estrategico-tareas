import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import {
  updateTask,
  deleteTask,
} from '../features/taskService'
import TodoForm from '../components/TodoForm'

function Tasks() {
  const { user } = useAuth()
  const { tasks, loading, error } = useTasks(user?.uid ?? null)

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const [sendingSummary, setSendingSummary] = useState(false)
  const [summaryMessage, setSummaryMessage] = useState('')
  const [summaryError, setSummaryError] = useState('')

  if (loading) {
    return <p>Cargando tareas...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!user) {
    return <p>No hay usuario autenticado.</p>
  }

  function handleEdit(taskId: string) {
    const task = tasks.find((task) => task.id === taskId)

    if (!task) {
      return
    }

    setEditingTaskId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  async function handleSaveEdit() {
    if (!editingTaskId) {
      return
    }

    try {
      await updateTask(editingTaskId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      })

      setEditingTaskId(null)
      setEditTitle('')
      setEditDescription('')
    } catch (error) {
      console.error(error)
    }
  }

  function handleCancelEdit() {
    setEditingTaskId(null)
    setEditTitle('')
    setEditDescription('')
  }

  async function handleToggleCompleted(
    taskId: string,
    completed: boolean,
  ) {
    try {
      await updateTask(taskId, {
        completed: !completed,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDelete(taskId: string) {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleSendSummary() {
  if (!user) {
    setSummaryError(
      'No hay usuario autenticado.',
    )
    return
  }

  const userEmail = user.email

  if (!userEmail) {
    setSummaryError(
      'No se encontró un correo para el usuario autenticado.',
    )
    return
  }

  setSendingSummary(true)
  setSummaryMessage('')
  setSummaryError('')

  try {
    const response = await fetch('/api/send-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        tasks,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'No fue posible enviar el resumen.',
      )
    }

    setSummaryMessage('Resumen enviado correctamente.')
  } catch (error) {
    console.error(error)

    setSummaryError(
      error instanceof Error
        ? error.message
        : 'No fue posible enviar el resumen.',
    )
  } finally {
    setSendingSummary(false)
  }
}

  return (
    <main>
      <h1>Mis tareas</h1>

      <TodoForm
        userId={user.uid}
        onTaskCreated={() => {}}
      />

      <section>
        <button
          type="button"
          onClick={handleSendSummary}
          disabled={sendingSummary}
        >
          {sendingSummary
            ? 'Enviando resumen...'
            : 'Enviar resumen por email'}
        </button>

        {summaryMessage && (
          <p>{summaryMessage}</p>
        )}

        {summaryError && (
          <p>{summaryError}</p>
        )}
      </section>

      {tasks.length === 0 ? (
        <p>No tienes tareas todavía.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {editingTaskId === task.id ? (
                <>
                  <div>
                    <label htmlFor={`edit-title-${task.id}`}>
                      Título
                    </label>

                    <input
                      id={`edit-title-${task.id}`}
                      value={editTitle}
                      onChange={(event) =>
                        setEditTitle(event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor={`edit-description-${task.id}`}>
                      Descripción
                    </label>

                    <textarea
                      id={`edit-description-${task.id}`}
                      value={editDescription}
                      onChange={(event) =>
                        setEditDescription(event.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                  >
                    Guardar cambios
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <strong>{task.title}</strong>

                  <p>{task.description}</p>

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleCompleted(
                        task.id,
                        task.completed,
                      )
                    }
                  >
                    {task.completed
                      ? 'Marcar como pendiente'
                      : 'Marcar como completada'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(task.id)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default Tasks