import {io as SocketIOClient} from 'socket.io-client' 
import { Server as SocketIOServer } from 'socket.io';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'; // Replace with your server URL

let io: SocketIOServer | null = null;

export const setIO = (socketIO: SocketIOServer) => {
  io = socketIO;
};

export const getIO = (): SocketIOServer | null => io;

const socket = SocketIOClient(SOCKET_URL);

export default socket;