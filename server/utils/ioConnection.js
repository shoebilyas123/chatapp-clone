const User = require("../models/user.model");
const { createRoom } = require("./socket");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected with SOCKETID:${socket.id}`);

    socket.on("joinRoom", (data) => {
      socket.leave(Array.from(socket.rooms)[1]);
      socket.join(createRoom(data.from, data.to));

      // const socketsConnected = await io
      //   .in(createRoom(data.from, data.to))
      //   .allSockets();

      // console.log(socketsConnected);
      // console.log(Array.from(socketsConnected));
      // console.log(Array.from(socketsConnected).length >= 2);

      // if (Array.from(socket.rooms).length > 2) {
      //   io.to(createRoom(data.from, data.to)).emit("showOnline");
      // } else {
      // }
      socket.to(createRoom(data.from, data.to)).emit("showOnline");

      socket.on("messageFromClient", async (data) => {
        console.log("HELLO");
        const message = {
          message: data.message,
          sentAt: Date.now(),
          room: createRoom(data.from, data.to),
        };
        await User.findByIdAndUpdate(data.from, {
          $push: { chatHistory: { ...message, from: "ME" } },
        }).select("chatHistory");
        await User.findByIdAndUpdate(data.to, {
          $push: { chatHistory: { ...message, from: "FRIEND" } },
        });

        io.to(createRoom(data.from, data.to)).emit("messageFromServer", {
          ...message,
          socketId: socket.id,
        });
      });
    });
  });
};
