import { useEffect, useState } from 'react'
import type { Task } from '../types/Task'
import { getTasks } from '../features/taskService'

export function useTasks(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadTasks() {
    if (!userId) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getTasks(userId)

      setTasks(data)
    } catch (error) {
      console.error(error)
      setError('No fue posible cargar las tareas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [userId])

  return {
    tasks,
    loading,
    error,
    loadTasks,
  }
}