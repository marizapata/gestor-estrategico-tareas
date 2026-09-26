import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

interface Task {
  title: string
  description: string
  completed: boolean
}

interface RequestBody {
  email: string
  tasks: Task[]
}

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
})

export default async function handler(
  request: any,
  response: any,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: 'Método no permitido',
    })
  }

  try {
    const body = request.body as RequestBody

    const { email, tasks } = body

    if (!email || !Array.isArray(tasks)) {
      return response.status(400).json({
        error: 'El correo y las tareas son obligatorios.',
      })
    }

    const completedTasks = tasks.filter(
      (task) => task.completed,
    )

    const pendingTasks = tasks.filter(
      (task) => !task.completed,
    )

    const taskList =
      tasks.length === 0
        ? '<p>No tienes tareas registradas.</p>'
        : `
          <ul>
            ${tasks
              .map(
                (task) => `
                  <li>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <span>
                      Estado:
                      ${
                        task.completed
                          ? 'Completada'
                          : 'Pendiente'
                      }
                    </span>
                  </li>
                `,
              )
              .join('')}
          </ul>
        `

    const html = `
      <h1>Resumen de tus tareas</h1>

      <p>
        Este es el resumen actual de tus tareas.
      </p>

      <p>
        <strong>Total:</strong> ${tasks.length}
      </p>

      <p>
        <strong>Completadas:</strong> ${completedTasks.length}
      </p>

      <p>
        <strong>Pendientes:</strong> ${pendingTasks.length}
      </p>

      <hr />

      ${taskList}
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Resumen de tus tareas',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
          },
        },
      },
    })

    await ses.send(command)

    return response.status(200).json({
      message: 'Resumen enviado correctamente.',
    })
  } catch (error) {
    console.error('Error enviando el correo:', error)

    return response.status(500).json({
      error: 'No fue posible enviar el correo.',
    })
  }
}