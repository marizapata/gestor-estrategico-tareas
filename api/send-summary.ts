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

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Método no permitido',
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }

  try {
    const body = (await request.json()) as RequestBody

    const { email, tasks } = body

    if (!email || !Array.isArray(tasks)) {
      return new Response(
        JSON.stringify({
          error: 'El correo y las tareas son obligatorios.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
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

    return new Response(
      JSON.stringify({
        message: 'Resumen enviado correctamente.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error enviando el correo:', error)

    return new Response(
      JSON.stringify({
        error: 'No fue posible enviar el correo.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}