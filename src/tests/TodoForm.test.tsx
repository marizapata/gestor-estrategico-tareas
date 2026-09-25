import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TodoForm from '../components/TodoForm'
import { createTask } from '../features/taskService'

vi.mock('../features/taskService', () => ({
  createTask: vi.fn(),
}))

describe('TodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra los campos y el botón para crear una tarea', () => {
    render(
      <TodoForm
        userId="user-123"
        onTaskCreated={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('textbox', { name: /título/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('textbox', { name: /descripción/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /crear tarea/i }),
    ).toBeInTheDocument()
  })

  it('muestra un error si se intenta crear una tarea sin título', async () => {
    const user = userEvent.setup()

    render(
      <TodoForm
        userId="user-123"
        onTaskCreated={vi.fn()}
      />,
    )

    await user.type(
      screen.getByRole('textbox', { name: /título/i }),
      '   ',
    )

    await user.click(
      screen.getByRole('button', { name: /crear tarea/i }),
    )

    expect(
      screen.getByText('El título es obligatorio.'),
    ).toBeInTheDocument()

    expect(createTask).not.toHaveBeenCalled()
  })

  it('crea una tarea y notifica cuando se completa correctamente', async () => {
    const user = userEvent.setup()
    const onTaskCreated = vi.fn()

    vi.mocked(createTask).mockResolvedValue({
      id: 'task-123',
    } as never)

    render(
      <TodoForm
        userId="user-123"
        onTaskCreated={onTaskCreated}
      />,
    )

    await user.type(
      screen.getByRole('textbox', { name: /título/i }),
      'Estudiar React',
    )

    await user.type(
      screen.getByRole('textbox', { name: /descripción/i }),
      'Repasar testing con Vitest',
    )

    await user.click(
      screen.getByRole('button', { name: /crear tarea/i }),
    )

    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Estudiar React',
        description: 'Repasar testing con Vitest',
        completed: false,
        userId: 'user-123',
      }),
    )

    expect(onTaskCreated).toHaveBeenCalledTimes(1)
  })

  it('muestra un error cuando no se puede crear la tarea', async () => {
    const user = userEvent.setup()

    vi.mocked(createTask).mockRejectedValue(
      new Error('Error de prueba'),
    )

    render(
      <TodoForm
        userId="user-123"
        onTaskCreated={vi.fn()}
      />,
    )

    await user.type(
      screen.getByRole('textbox', { name: /título/i }),
      'Estudiar React',
    )

    await user.click(
      screen.getByRole('button', { name: /crear tarea/i }),
    )

    expect(
      screen.getByText('No fue posible crear la tarea.'),
    ).toBeInTheDocument()
  })
})