# VitaTrack - Tu Acompañante de Hábitos Saludables

Aplicación móvil para el seguimiento de hábitos saludables, incluyendo ejercicio, nutrición, sueño y más.

## 🚀 Características

- Registro de actividad física diaria
- Seguimiento de hábitos saludables
- Monitoreo de sueño
- Estadísticas y progreso
- Interfaz intuitiva y fácil de usar

## 🛠 Tecnologías

- React Native
- Expo
- TypeScript
- Firebase (autenticación y base de datos)
- React Navigation

## 🚀 Cómo Empezar

### Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Un dispositivo móvil con la app de Expo Go o un emulador

### Instalación

1. Clona el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/vitatrack.git](https://github.com/tu-usuario/vitatrack.git)

2. Navega al directorio del proyecto:
   ```bash
   cd vitatrack

3. Instala las dependencias:
   ```bash
   npm install

4. Inicia la aplicación:
   ```bash
   npm start

## ☁️ Despliegue en Vercel

1. Asegúrate de que la app web funcione localmente:
   ```bash
   npm run web
   ```

2. Sube el proyecto a GitHub.

3. En Vercel, importa el repositorio y configura:
   - Build command: `npm run vercel-build`
   - Output directory: `web-build`

4. Si usas rutas en la app, Vercel debe reenviar todas las rutas a `index.html`. Ya hay un archivo `vercel.json` para eso.

5. Agrega tus variables de entorno en Vercel si usas Firebase u otros servicios.
