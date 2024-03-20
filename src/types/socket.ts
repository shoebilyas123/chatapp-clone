import { Socket } from 'socket.io';
import {
  CHAT_DISCONNECT,
  OPEN_CHAT,
  REC_CHAT,
  SEND_CHAT,
  SHOW_ONLINE,
} from '../constants/socket';

interface IEventsDataParams {
  [REC_CHAT]: {
    from: string;
    to: string;
    socketId: string;
    message: string;
    sentAt: number;
  };
  [SEND_CHAT]: {
    message: string;
    sent_to: string;
    sent_from: string;
  };
  [OPEN_CHAT]: {
    from: string;
    to: string;
  };
}

export interface SocketData {
  userId: string | number;
}

export interface ServerToClientEvents {
  [SHOW_ONLINE]: (_uid: string) => void;
  [CHAT_DISCONNECT]: (_: { userDisconnected: string }) => void;
  [REC_CHAT]: (_: IEventsDataParams[`REC_CHAT`]) => void;
}

export interface ClientToServerEvents {
  [SEND_CHAT]: (_: IEventsDataParams['SEND_CHAT']) => Promise<void>;
  [OPEN_CHAT]: (_: IEventsDataParams['OPEN_CHAT']) => Promise<void>;
}

export interface ITypedSocket
  extends Socket<ClientToServerEvents, ServerToClientEvents> {}

export interface InterServerEvents {}
