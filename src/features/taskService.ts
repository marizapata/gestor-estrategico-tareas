import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
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

export async function getTasks(userId: string) {
  const tasksCollection = collection(db, 'tasks')

  const tasksQuery = query(
    tasksCollection,
    where('userId', '==', userId),
  )

  const snapshot = await getDocs(tasksQuery)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[]
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
