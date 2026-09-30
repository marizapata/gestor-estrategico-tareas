# Gestor Estratégico de Tareas

Aplicación web SPA para la gestión de tareas diarias, desarrollada con React y TypeScript.

El proyecto permite a los usuarios registrarse, iniciar sesión y gestionar sus tareas de manera organizada y persistente mediante Firebase Authentication y Cloud Firestore.

La aplicación incorpora además un sistema de envío de resúmenes de tareas mediante AWS SES y una función backend desplegada en Vercel.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Firebase Authentication
- Cloud Firestore
- AWS SES
- Vercel
- Vitest
- React Testing Library

---

## Funcionalidades

### Autenticación

- Registro de usuarios mediante email y contraseña.
- Inicio de sesión.
- Cierre de sesión.
- Protección de rutas privadas.
- Manejo de errores de autenticación.

### Gestión de tareas

Cada usuario autenticado puede:

- Crear tareas.
- Visualizar sus tareas.
- Editar tareas.
- Eliminar tareas.
- Marcar tareas como completadas.
- Mantener las tareas almacenadas de forma persistente.

Cada usuario solamente puede acceder a sus propias tareas.

### Persistencia

Las tareas se almacenan en Cloud Firestore y se relacionan con el usuario autenticado mediante su `userId`.

La aplicación actualiza la interfaz después de las operaciones CRUD y contempla estados de carga y manejo de errores.

---

## Envío de emails

La aplicación permite enviar un resumen del estado de todas las tareas mediante el botón:

**"Enviar resumen por email"**

El envío utiliza AWS SES mediante una función backend desplegada en Vercel.

Las credenciales de AWS se manejan mediante variables de entorno y no se exponen directamente en el frontend.

El flujo de comunicación es:

```text
Usuario
   ↓
Aplicación React
   ↓
POST /api/send-summary
   ↓
Vercel Function
   ↓
AWS SES
   ↓
Correo electrónico
```

La función recibe:

- Correo electrónico del usuario.
- Lista de tareas.

Posteriormente genera un resumen que incluye:

- Total de tareas.
- Tareas completadas.
- Tareas pendientes.
- Detalle de cada tarea.
- Estado de cada tarea.

---

## Testing

El proyecto utiliza:

- Vitest.
- React Testing Library.

Se incluyen pruebas unitarias y pruebas de componentes principales.

Los servicios externos pueden aislarse mediante mocks cuando corresponde.

Para ejecutar las pruebas:

```bash
npm run test
```

---

## Arquitectura del proyecto

```text
project-root/

├── api/
│   └── send-summary.ts
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── firebase/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── tests/
│   └── types/
│
├── .env
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── package.json
├── README.md
├── setupTests.ts
├── tsconfig.json
└── vite.config.ts
```

### Organización de carpetas

#### `components/`

Contiene componentes reutilizables de la interfaz.

#### `features/`

Contiene la lógica relacionada con los principales dominios de la aplicación, como autenticación y gestión de tareas.

#### `firebase/`

Contiene la configuración necesaria para conectar la aplicación con Firebase.

#### `hooks/`

Contiene hooks personalizados como autenticación y gestión de tareas.

#### `pages/`

Contiene las páginas principales:

- Home
- Login
- Register
- Tasks

#### `routes/`

Contiene la configuración de navegación y protección de rutas.

#### `tests/`

Contiene las pruebas automatizadas.

#### `types/`

Contiene interfaces y tipos compartidos de TypeScript.

#### `api/`

Contiene las funciones backend utilizadas para integraciones externas, como el envío de emails mediante AWS SES.

---

## Variables de entorno

El proyecto utiliza variables de entorno para evitar almacenar credenciales directamente en el código fuente.

### Firebase

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### AWS

```env
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SES_FROM_EMAIL=
```

El archivo `.env` contiene los valores utilizados durante el desarrollo y despliegue.

El archivo `.env.example` contiene únicamente los nombres de las variables y no contiene información sensible.

---

## Seguridad

Las credenciales y variables sensibles se manejan mediante variables de entorno.

El archivo `.env` se encuentra excluido del repositorio mediante `.gitignore`.

Las credenciales de AWS no se exponen en el frontend.

Las operaciones de Firestore están protegidas mediante reglas de seguridad.

Cada usuario solamente puede acceder a sus propias tareas.

Las credenciales utilizadas por AWS SES son consumidas desde el entorno backend y no se incluyen directamente en el código del cliente.

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/marizapata/gestor-estrategico-tareas.git
```

Ingresar al proyecto:

```bash
cd gestor-estrategico-tareas
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` utilizando `.env.example` como referencia.

Completar las variables de entorno correspondientes a Firebase y AWS.

Ejecutar el proyecto en desarrollo:

```bash
npm run dev
```

Ejecutar las pruebas:

```bash
npm run test
```

Crear una compilación de producción:

```bash
npm run build
```

---

## Deploy

La aplicación está desplegada en Vercel.

URL de producción:

https://gestor-estrategico-tareas.vercel.app

El despliegue utiliza las variables de entorno configuradas en Vercel.

La aplicación frontend y las funciones backend se ejecutan dentro del entorno de Vercel.

---

## Flujo de autenticación

```text
Usuario
   ↓
Registro / Login
   ↓
Firebase Authentication
   ↓
Usuario autenticado
   ↓
Ruta protegida
   ↓
Gestión de tareas
```

---

## Flujo de gestión de tareas

```text
Usuario autenticado
        ↓
Crear / editar / eliminar / completar
        ↓
Servicio de tareas
        ↓
Cloud Firestore
        ↓
Actualización de la interfaz
```

---

## Flujo de envío de emails

```text
Usuario
        ↓
Botón "Enviar resumen por email"
        ↓
Frontend React
        ↓
POST /api/send-summary
        ↓
Vercel Function
        ↓
AWS SES
        ↓
Correo electrónico
```

La función backend utiliza las credenciales de AWS almacenadas como variables de entorno.

El frontend solamente solicita el envío del resumen y no tiene acceso directo a las credenciales secretas de AWS.

---

## Decisiones arquitectónicas

Se utilizó React con TypeScript para construir una SPA modular, reutilizable y con tipado estático.

Firebase Authentication se utiliza para gestionar la autenticación de usuarios.

Cloud Firestore permite almacenar las tareas de manera persistente y asociarlas con cada usuario.

La lógica de la aplicación se separó en componentes, features, hooks, rutas y tipos para facilitar el mantenimiento y reutilización del código.

AWS SES se utiliza para el envío de emails y se accede mediante una función backend para evitar exponer las credenciales de AWS en el cliente.

Vercel se utiliza como plataforma de despliegue de la aplicación y de las funciones backend.

Esta arquitectura permite mantener separadas las responsabilidades del frontend, los servicios de persistencia y las integraciones externas.

---

## Control de versiones

El proyecto utiliza Git y GitHub para el control de versiones.

Los cambios se registran mediante commits descriptivos y semánticos.

Las variables sensibles no se incluyen en los commits.

El repositorio del proyecto se encuentra disponible en:

https://github.com/marizapata/gestor-estrategico-tareas

---

## Uso de inteligencia artificial

La inteligencia artificial fue utilizada como herramienta de apoyo durante el proceso de desarrollo.

Se utilizó principalmente para:

- Comprender conceptos de React y TypeScript.
- Analizar errores de programación.
- Revisar la arquitectura del proyecto.
- Comprender la integración con Firebase.
- Comprender la integración con AWS SES.
- Apoyar la creación y revisión de pruebas.
- Analizar errores durante el despliegue.
- Revisar documentación y estructura del proyecto.
- Apoyar la identificación y solución de errores durante el desarrollo.

La IA se utilizó como apoyo al aprendizaje y desarrollo, manteniendo la responsabilidad de comprender, revisar y validar el código utilizado en el proyecto.

---

## Cumplimiento de los objetivos del proyecto

El proyecto implementa los principales objetivos establecidos para el Proyecto Integrador:

- Aplicación SPA desarrollada con React y TypeScript.
- Componentes reutilizables mediante JSX/TSX.
- Tipado mediante TypeScript.
- Arquitectura modular.
- Autenticación de usuarios.
- Protección de rutas.
- Gestión completa de tareas mediante CRUD.
- Persistencia mediante Cloud Firestore.
- Asociación de tareas con usuarios autenticados.
- Manejo de estados de carga y errores.
- Integración con AWS SES.
- Función backend para el envío de emails.
- Variables de entorno para configuración y credenciales.
- Testing con Vitest y React Testing Library.
- Control de versiones mediante Git y GitHub.
- Deploy en Vercel.
- Documentación del proyecto.
- Uso documentado de inteligencia artificial como herramienta de apoyo al desarrollo.

---

## Autor

**Mariana Zapata**

## Gestión de mi día a día

Proyecto Integrador - Desarrollo Full Stack