const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const walletAddress = socket.handshake.auth.walletAddress;
  if (!walletAddress) {
    return next(new Error("invalid walletAddress"));
  }
  socket.walletAddress = walletAddress;
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];
  for (let [id, userSocket] of io.of("/").sockets) {
    users.push({
      socketId: id,
      walletAddress: userSocket.walletAddress,
    });
  }

  const userNotConnected = users.findIndex((user) => user.walletAddress === socket.walletAddress && socket.id !== user.socketId) === -1

  if(!userNotConnected) {
    socket.emit("user_already_connected");
    socket.disconnect();
    return;
  }

  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user_connected", {
    socketId: socket.id,
    walletAddress: socket.walletAddress,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

const SOCKET_PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(SOCKET_PORT, () =>
  console.log(`server listening at http://localhost:${SOCKET_PORT}`)
);