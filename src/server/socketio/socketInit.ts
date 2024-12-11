import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "node:http";
import { client } from "@/src/server/redis/redisInit";


async function joinGroup(socket: Socket, userId: string) {
  const userRooms = await client.zrange(`user:${userId}:groups`, 0, -1) as string[];
  userRooms.forEach((roomId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room with room ID: ${roomId}`);
  });
}

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
        await client.hset("onlineUsers", userId, socket.id);
        console.log(`User ${userId} already registered with socket ID: ${socket.id}`);
        await joinGroup(socket, userId);
      } catch (error) {
        console.error("Error registering user:", error);
      }
    });

    socket.on("newGroup", async ({groupMembers, roomId}) => {
      console.log("room ID: ", roomId);
      console.log("groupMembers: ", groupMembers);
      for (const id of groupMembers) {
        console.log("member id: ", id);
        const recipientSocketID = await client.hget("onlineUsers", id);
        if (recipientSocketID) {
          io.to(recipientSocketID).emit("groups");
          io.sockets.sockets.get(recipientSocketID)?.join(roomId)
        }
      }
    })
    
    socket.on("newFriendRequest", async (friendRequest) => {
      const { idToAdd } = friendRequest;
      const recipientSocketID = await client.hget("onlineUsers", idToAdd);

      if (recipientSocketID) {
        io.to(recipientSocketID).emit("friendsRequest");
      } else {
        console.log(`Recipient with UserID ${idToAdd} is not connected!`);
      }
    });

    socket.on("newFriend", async (friend) => {
      const { idToAdd } = friend;
      const recipientSocketID = await client.hget("onlineUsers", idToAdd);

      if (recipientSocketID) {
        socket.to(recipientSocketID).emit("friends");
      }
      socket.emit("friends");
    });

    socket.on("newMessage", async (data) => {
      const { chatType, senderId, roomId } = data;
      console.log("chatType: ", chatType)
      console.log("senderId: ", senderId)
      console.log("roomId: ", roomId)

      if (chatType === "direct") {
        const recipientSocketID = await client.hget("onlineUsers", senderId);
        if (recipientSocketID) {
          io.to(recipientSocketID).emit("messages");
        }
        socket.emit("messages");
      }
      else if (chatType === "group") {
        io.to(roomId).emit("messages");
      }
    });

    socket.on("disconnect", async () => {
      const userId = socket.data.userId;

      try {
        client.hdel("onlineUsers", userId);
        console.log(
          `User ${userId} disconnected and removed from online users.`
        );
      } catch (error) {
        console.error("Error removing user on disconnect:", error);
      }
    });
  });
}
