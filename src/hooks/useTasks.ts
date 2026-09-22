import { useEffect, useState } from 'react'
import type { Task } from '../types/Task'
import { subscribeToTasks } from '../features/taskService'

export function useTasks(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const unsubscribe = subscribeToTasks(
      userId,
      (data) => {
        setTasks(data)
        setLoading(false)
      },
      (error) => {
        console.error(error)
        setError('No fue posible cargar las tareas.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [userId])

  return {
    tasks,
    loading,
    error,
  }
}