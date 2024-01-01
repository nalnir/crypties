const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const authObject = socket.handshake.auth;
  const walletAddress = authObject.walletAddress;
  const battleDeckAmount = authObject.battleDeckAmount
  const hero = authObject.hero
  const battleDeckId = authObject.battleDeckId
  const userStats = authObject.userStats

  if (!walletAddress) {
    return next(new Error("invalid walletAddress"));
  }
  socket.walletAddress = walletAddress;
  socket.battleDeckAmount = battleDeckAmount;
  socket.cardsOnTheTable = [];
  socket.hero = hero
  socket.battleDeckId = battleDeckId
  socket.userStats = userStats
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];
  const activePlayers = []
  for (let [id, userSocket] of io.of("/").sockets) {
    users.push({
      socketId: id,
      walletAddress: userSocket.walletAddress,
      battleDeckAmount: userSocket.battleDeckAmount,
      hero: userSocket.hero,
      battleDeckId: userSocket.battleDeckId,
      userStats: userSocket.userStats
    });
  }

  console.log('users: ', users)

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

    const disconnectedPlayerIdx = users.findIndex((user) => user.socketId === socket.id)
    const disconnectedActivePlayerIdx = activePlayers.findIndex((user) => user.socketId === socket.id)
    
    users.splice(disconnectedPlayerIdx, 1)
    activePlayers.splice(disconnectedActivePlayerIdx, 1)
  });

  socket.on('join_battle_room', (players) => {
    activePlayers.push({ id: socket.id, ...players });
    users.splice(users.findIndex((user) => user.socketId === socket.id), 1)

    // Create a unique battle room for the two players
    const battleRoom = `battle_${players.player1.walletAddress}_${players.player2.walletAddress}`;

    // Join both players to the battle room
    socket.join(battleRoom);
    io.to(players.player1.socketId).emit('battle_start', { room: battleRoom, mySocketId: players.player1.socketId, opponent: players.player2, myTurn: true });
    io.to(players.player2.socketId).emit('battle_start', { room: battleRoom, mySocketId: players.player2.socketId, opponent: players.player1, myTurn: false });
  });

  socket.on('flip_turn', () => {
    io.emit('flip_turn');
  })

  socket.on('set_opponent_state', (data) => {
    io.to(data.to).emit('set_opponent_state', data.opponent)
  })

  socket.on('damaged_cards_on_the_table', (data) => {
    io.to(data.to).emit('damaged_cards_on_the_table', data.damagedCardsOnTheTable)
  })

  socket.on('damaged_hero', (data) => {
    io.to(data.to).emit('damaged_hero', data.damagedHero)
  })

  socket.on('defeated', (data) => {
    io.to(data.to).emit('defeated')
  })
});

const SOCKET_PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(SOCKET_PORT, () =>
  console.log(`server listening at http://localhost:${SOCKET_PORT}`)
);