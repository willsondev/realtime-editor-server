const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Configuración de CORS. Usar "*" es flexible, pero para producción
// podrías restringirlo a la URL de tu Vercel.
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Usa el puerto asignado por Render o el 3001 para desarrollo local
const PORT = process.env.PORT || 3001;

// Objeto para almacenar la lista de usuarios por cada sala.
// La estructura es: { roomId: [{ id, username }, { id, username }] }
const roomUsers = {};

// Lógica principal de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log(`🔌 Un usuario se ha conectado con el id: ${socket.id}`);

  // Evento para unirse a una sala
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`✅ Usuario ${username} (ID: ${socket.id}) se unió a la sala ${roomId}.`);

    // Inicializa el array de la sala si no existe
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }
    
    // VERIFICACIÓN ANTI-DUPLICADOS:
    // Se comprueba si el usuario ya existe en la sala antes de añadirlo.
    const userExists = roomUsers[roomId].some(user => user.id === socket.id);
    if (!userExists) {
      roomUsers[roomId].push({ id: socket.id, username });
    }

    // Se emite la lista de usuarios actualizada (ya sin duplicados) a todos en la sala.
    io.to(roomId).emit('room-users-update', roomUsers[roomId]);
  });

  // Evento para los cambios en el código
  socket.on('code-change', ({ roomId, code }) => {
    // Se emite el cambio a todos en la sala, excepto al remitente
    socket.broadcast.to(roomId).emit('code-update', code);
  });

  // Evento para cuando un usuario se desconecta
  socket.on('disconnect', () => {
    console.log(`👋 El usuario con id ${socket.id} se ha desconectado`);

    // Lógica para eliminar al usuario de la lista de participantes
    for (const roomId in roomUsers) {
      const usersInRoom = roomUsers[roomId];
      
      // Se busca al usuario por su socket.id
      const userIndex = usersInRoom.findIndex(user => user.id === socket.id);
      
      if (userIndex !== -1) {
        // Se elimina al usuario de la lista
        const disconnectedUser = usersInRoom.splice(userIndex, 1)[0];
        
        // Se emite la lista actualizada al resto de usuarios en la sala
        io.to(roomId).emit('room-users-update', usersInRoom);
        
        console.log(`🧹 Usuario ${disconnectedUser.username} eliminado de la sala ${roomId}`);
        break; // Se rompe el bucle una vez encontrado y eliminado
      }
    }
  });
});


server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});