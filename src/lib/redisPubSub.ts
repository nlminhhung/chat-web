// import { Server as SocketIOServer } from 'socket.io';
// import { redisSubscriber } from './db.js'; 


// export async function setupRedisSubscription(io: SocketIOServer) {
//   try {
//     // Subscribe to the "message" channel
//     const stream = (await redisSubscriber.subscribe("message")) as string[] | [];

//     // Listen for messages from the Redis subscription
//     for await (const message of stream) {
//       io.emit('newMessage', message);
//     }
//   } catch (error) {
//     console.error('Error in setupRedisSubscription:', error);
//   }
// }

// export async function publishMessage(channel: string, message: string) {
//   try {
//     await redisSubscriber.publish(channel, message);
//   } catch (error) {
//     console.error('Error in publishMessage:', error);
//   }
// }


