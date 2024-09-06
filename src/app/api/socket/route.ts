import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
let io: Server;

export async function GET() {
  if (io) {
    console.log('Socket is already running');
    return NextResponse.json({ message: 'Socket is already running' });
  }
  console.log('Initializing Socket.IO');
  io = new Server({
    path: '/api/socket',
    cors: {
      origin: "*",
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.emit("hello", "world");
    // socket.on('fetchFriends', (userId: string) => {
    //   // Handle fetching friends from Redis or other data sources
    //   console.log(`Fetching friends for userId: ${userId}`);
    //   // Example: socket.emit('friendsList', friends);
    // });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
    
  });
  
  return NextResponse.json({ message: 'Socket.IO initialized' });
}
