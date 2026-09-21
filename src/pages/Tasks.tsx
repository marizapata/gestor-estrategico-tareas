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
  const { tasks, loading, error, loadTasks } = useTasks(user?.uid ?? null)

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

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

      await loadTasks()
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

      await loadTasks()
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDelete(taskId: string) {
    try {
      await deleteTask(taskId)
      await loadTasks()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <h1>Mis tareas</h1>

      <TodoForm
        userId={user.uid}
        onTaskCreated={loadTasks}
      />

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