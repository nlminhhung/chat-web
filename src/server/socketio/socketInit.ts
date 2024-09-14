import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "node:http";
import { client } from "@/src/server/redis/redisInit";
export function createSocketServer(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("registerUsers", async (userId: string) => {
      try {
        socket.data.userId = userId;
        await client.hset("onlineUsers", userId, socket.id)
        console.log(
          `User ${userId} already registered with socket ID: ${socket.id}`
        );
      } catch (error) {
        console.error("Error registering user:", error);
      }
    });

    socket.emit("Hello_world")
    socket.on("FriendRequest", async ({ idToAdd, userId }) => {
      
      console.log(`Friend request from ${userId} to ${idToAdd} added.`);
    });

    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      console.log(`On disconnect: ${userId}`);

      try {
        client.hdel('onlineUsers', userId);
        console.log(`User ${userId} disconnected and removed from online users.`);
      } catch (error) {
        console.error('Error removing user on disconnect:', error);
      }
    });
  });

}
