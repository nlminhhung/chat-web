// // import {client} from "@/src/lib/db";
// import { Redis } from "ioredis";
// import { Server as SocketIOServer } from 'socket.io';


// const friendRequestsChannel = 'friendRequests';
// const redis = new Redis();
// export function subscribeToFriendRequests(io: SocketIOServer) {
//     redis.subscribe(friendRequestsChannel, (err, count) => {
//     if (err) {
//       console.error('Failed to subscribe to Redis channel:', err);
//     } else {
//       console.log(`Subscribed to ${friendRequestsChannel}, count: ${count}`);
//     }
//   });

//   redis.on('message', (channel, message) => {
//     if (channel === friendRequestsChannel) {
//       const request = JSON.parse(message);
//       console.log('New friend request notification:', request);
//       io.to(request.toUser).emit('newFriendRequest', request);
//     }
//   });
// }

// // Publish a friend request event
// export async function publishFriendRequest(request: any) {
//   await redis.publish(friendRequestsChannel, JSON.stringify(request));
// }
