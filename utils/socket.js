const { Server } = require("socket.io");

module.exports = function (server) {
  global.io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {});
};