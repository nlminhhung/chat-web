import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'node:http';


export function createSocketServer(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
    },
  });

  let userSocketMap = new Map<string, string>();
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('registerUser', (userId) => {
        if (userSocketMap.has(userId)) {
            console.log(`User ${userId} already registered with socket ID ${userSocketMap.get(userId)}`);
        }
        else {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} registered with new socket ID ${socket.id}`);
        }
    });

    socket.on('sendFriendRequest', async ({ idToAdd, userId }) => {
        // await publishFriendRequest(idToAdd);

      console.log(`Friend request from ${userId} to ${idToAdd} added.`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        userSocketMap.forEach((socketId, userId) => {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });
  });

//   subscribeToFriendRequests(io);
}
