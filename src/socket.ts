// Global Imports
import User from './models/user.model';

// Local Imports
import { Server, Socket } from 'socket.io';
import {
  CHAT_DISCONNECT,
  OPEN_CHAT,
  REC_CHAT,
  SEND_CHAT,
  SHOW_ONLINE,
} from './constants/socket';
import { createRoom } from './lib/socket';

// Custom Type Imports
import type { IOpenChatReq } from './types';
import RedisCli from './lib/redis';
import chatModel from './models/chat.model';

class IOSocket {
  private _io: Server;
  private dbLimiter: Record<string, number>;
  private rediscli;

  public get io() {
    return this._io;
  }

  constructor(_server: Express.Application, _opts?: Record<string, any>) {
    this._io = new Server(_server, _opts);
    this.dbLimiter = {};
    this.rediscli = RedisCli;
  }

  /**
   *  @description Emits an event to all the friends of the current user to inform that the user is now online.
   * @param socket IO connection socket
   * @param userId Id of the user that requested an RTC connection
   * @returns {void}
   */
  public async showOnline(socket: Socket) {
    const user = await User.findById(socket.data.userId).select('friends');
    if (!user) {
      console.log('404 User Not Found');
      return;
    }
    const sendOnlineEventTO = (user?.friends as string[]).map((fr) => fr);
    socket.to(sendOnlineEventTO).emit(SHOW_ONLINE, user.id);
  }

  public initListeners() {
    const io = this.io;

    io.on('connection', async (socket) => {
      // Socket: IO Client Socket with data = {userId:string}

      await this.showOnline(socket);

      // Client requests to join a a room
      socket.on(OPEN_CHAT, async (openChatData: IOpenChatReq) => {
        const _roomId = createRoom(openChatData.from, openChatData.to);
        await this.rediscli.connect();
        this.dbLimiter[_roomId] = 0;
        // Leave the previously joined room by removing the room from the list of sockets for the current io connection

        await socket.leave(Array.from(socket.rooms)[1] as string);
        await socket.join(_roomId);

        socket.on(
          SEND_CHAT,
          async (data: {
            message: string;
            sent_to: string;
            sent_from: string;
          }) => {
            const message = {
              message: data.message,
              sentAt: Date.now(),
              roomId: _roomId,
            };

            // Store the latest 10 chats in redis and not in DB
            // Once the chat history exceed 10 for a certain room, flush the chats to the DB
            // ChatHistory Redis Structure: {roomId: string; history: [{message: data.message,sentAt: Date.now(); from: string; to: string }]}
            if (!(await this.rediscli.cli.json.type(_roomId))) {
              this.rediscli.cli.json.set(_roomId, '$', {});
            }

            if ((this.dbLimiter[_roomId] as number) < 10) {
              await this.rediscli.cli.json.arrAppend(_roomId, '.history', {
                message: message.message,
                sentAt: message.sentAt,
                from: data.sent_from,
                to: data.sent_to,
              });

              this.dbLimiter[_roomId] += 1;
            } else {
              const temp_msgs = await this.rediscli.cli.json.get(_roomId);

              await chatModel.findOneAndUpdate(
                {
                  userId: { $in: _roomId.split('|') },
                  contactId: { $in: _roomId.split('|') },
                },
                {
                  $push: {
                    history: (temp_msgs as Record<string, any>).history,
                  },
                }
              );

              await this.rediscli.cli.json.del(_roomId);
              this.dbLimiter[_roomId] = 0;
            }

            socket.to(_roomId).emit(REC_CHAT, {
              ...message,
              from: data.sent_from,
              to: data.sent_to,
              socketId: socket.id,
            });
          }
        );

        // Whenever socket disconnects close the connection after emitting a user disconnected event
        socket.on('disconnect', (reason) => {
          socket
            .to(_roomId)
            .emit(CHAT_DISCONNECT, { userDisconnected: socket.data.userId });
          socket.disconnect(true);
        });
      });

      console.log(`New Connection - SOCKET:${socket.id}`);
    });
  }
}

export default IOSocket;
