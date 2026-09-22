import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

import { db } from '../firebase/config'
import type { Task } from '../types/Task'

export async function createTask(task: Omit<Task, 'id'>) {
  const tasksCollection = collection(db, 'tasks')

  return await addDoc(tasksCollection, task)
}

export function subscribeToTasks(
  userId: string,
  onTasksChange: (tasks: Task[]) => void,
  onError: (error: Error) => void,
) {
  const tasksCollection = collection(db, 'tasks')

  const tasksQuery = query(
    tasksCollection,
    where('userId', '==', userId),
  )

  const unsubscribe = onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Task[]

      onTasksChange(tasks)
    },
    (error) => {
      onError(error)
    },
  )

  return unsubscribe
}

export async function updateTask(
  taskId: string,
  changes: Partial<Omit<Task, 'id'>>,
) {
  const taskReference = doc(db, 'tasks', taskId)

  await updateDoc(taskReference, changes)
}

export async function deleteTask(taskId: string) {
  const taskReference = doc(db, 'tasks', taskId)

  await deleteDoc(taskReference)
}