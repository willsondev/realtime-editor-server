# ⚙️ Servidor para Editor de Código Colaborativo

Este es el servidor backend para la aplicación [Editor de Código Colaborativo](https://realtime-editor-client.vercel.app/). Está construido con Node.js, Express y Socket.IO para manejar toda la comunicación en tiempo real.

### ▶️ [Ver la Aplicación Frontend en Vivo](https://realtime-editor-client.vercel.app/)

## 📋 Funcionalidades del Servidor

- **Gestión de Sockets:** Maneja las conexiones y desconexiones de múltiples clientes.
- **Sistema de Salas (Rooms):** Utiliza la funcionalidad de salas de Socket.IO para aislar la comunicación entre diferentes grupos de usuarios.
- **Sincronización de Estado:**
  - Rastrea qué usuarios están en qué sala.
  - Transmite (broadcast) los cambios de código a todos los clientes de una sala específica.
  - Emite la lista actualizada de participantes cada vez que un usuario se une o se va.
- **Desplegado en la Nube:** El servidor está desplegado en Render y configurado para escalabilidad.

## 🛠️ Stack Tecnológico

- **Entorno de Ejecución:** Node.js
- **Framework:** Express
- **WebSockets:** Socket.IO

## ⚙️ Configuración y Desarrollo Local

Sigue estos pasos para correr el servidor en tu máquina local:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/realtime-editor-server.git](https://github.com/tu-usuario/realtime-editor-server.git)
   cd realtime-editor-server
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor:**
   ```bash
   npm start
   ```
   El servidor se iniciará en `http://localhost:3001` (o en el puerto definido por `process.env.PORT`).