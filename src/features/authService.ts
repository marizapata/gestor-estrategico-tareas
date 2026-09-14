import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import { auth } from '../firebase/config'

function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code

    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado.'

      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.'

      case 'auth/weak-password':
        return 'La contraseña es demasiado débil.'

      case 'auth/invalid-credential':
        return 'El correo o la contraseña son incorrectos.'

      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo.'

      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.'

      default:
        return 'Ocurrió un error. Inténtalo nuevamente.'
    }
  }

  return 'Ocurrió un error. Inténtalo nuevamente.'
}

export async function registerUser(email: string, password: string) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}

export async function loginUser(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}

export async function logoutUser() {
  try {
    return await signOut(auth)
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}