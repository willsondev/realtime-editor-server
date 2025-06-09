const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// --- NUEVO: Objeto para almacenar usuarios por sala ---
const roomUsers = {};

io.on('connection', (socket) => {
  console.log(`🔌 Un usuario se ha conectado con el id: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`✅ Usuario ${socket.id} se unió a la sala ${roomId}.`);

    // --- LÓGICA DE USUARIOS: Añadir usuario a la sala ---
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }
    roomUsers[roomId].push(socket.id);

    // --- Emitir la lista de usuarios actualizada a TODOS en la sala ---
    io.to(roomId).emit('room-users-update', roomUsers[roomId]);
  });

  socket.on('code-change', ({ roomId, code }) => {
    socket.broadcast.to(roomId).emit('code-update', code);
  });

  socket.on('disconnect', () => {
    console.log(`👋 El usuario con id ${socket.id} se ha desconectado`);

    // --- LÓGICA DE USUARIOS: Eliminar usuario de la sala al desconectar ---
    // Encontramos la sala en la que estaba el usuario
    for (const roomId in roomUsers) {
      const usersInRoom = roomUsers[roomId];
      const userIndex = usersInRoom.indexOf(socket.id);
      
      if (userIndex !== -1) {
        // Eliminamos al usuario de la lista
        usersInRoom.splice(userIndex, 1);
        
        // Emitimos la lista actualizada a los usuarios restantes en la sala
        io.to(roomId).emit('room-users-update', usersInRoom);
        
        console.log(`🧹 Usuario ${socket.id} eliminado de la sala ${roomId}`);
        break; // Rompemos el bucle una vez encontrado y eliminado
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});