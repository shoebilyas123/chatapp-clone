const User = require('../models/user.model');
const { createRoom } = require('./socket');
const RedisService = require('./redis');

const redis = require('redis');
const rediscli = new RedisService();

module.exports = async (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected with SOCKETID:${socket.id}`);

    socket.on('joinRoom', (data) => {
      const roomId = createRoom(data.from, data.to);

      socket.leave(Array.from(socket.rooms)[1]);
      socket.join(roomId);
      // store the list of online users in redis db
      socket.to(roomId).emit('showOnline');

      socket.on('messageFromClient', async (data) => {
        console.log('HELLO');
        // await rediscli.connect();
        const cli = redis.createClient();

        const message = {
          message: data.message,
          sentAt: Date.now(),
          room: roomId,
        };

        //---
        // save the chats to redis instead
        // save a specific size of chat to redis
        await cli.connect();
        const chatHistoryKey = `CHAT:${roomId}`;
        const len = await cli.LPUSH(chatHistoryKey, JSON.stringify(message));

        if (len == 10) {
          // User a different Collection for chats and reference it from the User.
          const temp_chats = await cli.LRANGE(chatHistoryKey, 0, 10);
        }
        // await User.findByIdAndUpdate(data.from, {
        //   $push: { chatHistory: { ...message, from: 'ME' } },
        // }).select('chatHistory');
        // await User.findByIdAndUpdate(data.to, {
        //   $push: { chatHistory: { ...message, from: 'FRIEND' } },
        // });
        // when buffer is filled, flush the chat to DB
        //---

        io.to(createRoom(data.from, data.to)).emit('messageFromServer', {
          ...message,
          socketId: socket.id,
        });
      });
    });
  });
};
