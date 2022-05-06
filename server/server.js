const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const socketio = require("socket.io");

const app = require("./app");
const ioConnection = require("./utils/ioConnection");
dotenv.config({ path: path.join(__dirname, "config.env") });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api for chatapp by Shoeb Ilyas is running...");
  });
}

const MONGOURI = process.env.MONGO_URI.replace(
  "<USERNAME>",
  process.env.DB_USERNAME
).replace("<PASSWORD>", process.env.DB_PASSWORD);
const PORT = process.env.PORT || 8000;

let server;

mongoose.connect(MONGOURI).then((con) => {
  console.log(con.connection.host);
  server = app.listen(PORT, () => {
    console.log(`Server running at PORT:${PORT}`);
  });
  const io = socketio(server, { cors: { origin: "*" } });
  ioConnection(io);
});
