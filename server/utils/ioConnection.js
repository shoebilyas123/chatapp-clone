const User = require("../models/user.model");
const { createRoom } = require("./socket");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected with SOCKETID:${socket.id}`);

    socket.on("joinRoom", (data) => {
      socket.join("ROOM");

      socket.on("messageFromClient", async (data) => {
        console.log({ data });
        const message = {
          message: data.message,
          sentAt: Date.now(),
        };
        await User.findByIdAndUpdate(data.from, {
          $push: { chatHistory: { ...message, from: "ME" } },
        });
        await User.findByIdAndUpdate(data.to, {
          $push: { chatHistory: { ...message, from: "FRIEND" } },
        });
        io.to("ROOM").emit("messageFromServer", {
          ...message,
          socketId: socket.id,
        });
      });
    });
  });
};
