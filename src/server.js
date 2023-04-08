const { Server } = require('http');
const next = require('next');
const express = require('express');
const socketIO = require('socket.io');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const http = Server(server);
  const io = socketIO(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // Your server code goes here

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
  });

  server.all('*', (req, res) => handle(req, res));

  http.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});