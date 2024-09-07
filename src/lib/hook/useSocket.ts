import { useEffect, useState} from 'react';
import io, { Socket } from 'socket.io-client';


export const useSocket = (userId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
    const socket = io(process.env.LOCAL_URL!, {
      transports: ['websocket'],
    });
    socket.emit('registerUser', userId);
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socket;
};
