import type { NextApiRequest, NextApiResponse } from 'next';
import { Server, Socket } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

interface PlayerSocket {
  socketId: string;
  socket: Socket;
}

const app = express();
const httpServer = createServer(app);

const rooms = new Map<string, Map<string, PlayerSocket>>();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  io.on('connection', (socket: Socket) => {
    console.log('a user connected', socket.id);

    const roomId = joinRoom(socket);
    console.log(`User ${socket.id} joined room ${roomId}`);

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      for (const [roomId, players] of rooms.entries()) {
        if (players.has(socket.id)) {
          players.delete(socket.id);
          if (players.size === 0) {
            rooms.delete(roomId);
          }
          break;
        }
      }
    });

    socket.on('get_rooms', () => {
      const availableRooms = getAvailableRooms();
      socket.emit('rooms_list', availableRooms);
    });

    // Add more event listeners and logic here
  });

  // HELPER FUNCTIONS
  function joinRoom(socket: Socket): string {
    for (const [roomId, players] of rooms.entries()) {
      if (players.size < 2) {
        players.set(socket.id, { socketId: socket.id, socket });
        socket.join(roomId);
        return roomId;
      }
    }
    const roomId = `room_${rooms.size}`;
    const players = new Map<string, PlayerSocket>();
    players.set(socket.id, { socketId: socket.id, socket });
    rooms.set(roomId, players);
    socket.join(roomId);
    socket.emit('room_joined', roomId, players.size);
    return roomId;
  }

  function getAvailableRooms(): Array<{ roomId: string; players: number }> {
    const availableRooms: Array<{ roomId: string; players: number }> = [];
    for (const [roomId, players] of rooms.entries()) {
      if (players.size < 2) {
        availableRooms.push({ roomId, players: players.size });
      }
    }
    return availableRooms;
  }

  const port = process.env.PORT || 3001;
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
