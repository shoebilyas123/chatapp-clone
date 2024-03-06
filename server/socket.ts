// Global Imports
import User from './models/user.model';

// Local Imports
import { Server, ServerOptions, Socket } from 'socket.io';
import {
  CHAT_DISCONNECT,
  OPEN_CHAT,
  REC_CHAT,
  SEND_CHAT,
  SHOW_ONLINE,
} from './constants/socket';
import { createRoom } from './utils/socket';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

// Custom Type Imports
import { IOpenChatReq } from './types';
class IOSocket {
  private _io: Server;

  public get io() {
    return this._io;
  }

  constructor(_server: Express.Application, _opts?: Partial<ServerOptions>) {
    this._io = new Server(_server, _opts);
  }

  /**
   *  @description Emits an event to all the friends of the current user to inform that the user is now online.
   * @param socket IO connection socket
   * @param userId Id of the user that requested an RTC connection
   * @returns {void}
   */
  public async showOnline(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
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
      socket.on(OPEN_CHAT, async (data: IOpenChatReq) => {
        const _roomId = createRoom(data.from, data.to);

        // Leave the previously joined room by removing the room from the list of sockets for the current io connection
        await socket.leave(Array.from(socket.rooms)[1]);
        await socket.join(_roomId);

        socket.on(SEND_CHAT, async (data: { message: string }) => {
          const message = {
            message: data.message,
            sentAt: Date.now(),
            roomId: _roomId,
          };

          
          socket
            .to(_roomId)
            .emit(REC_CHAT, { ...message, socketId: socket.id });
        });

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
