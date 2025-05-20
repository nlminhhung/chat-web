import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "node:http";
import { client } from "@/src/server/redis/redisInit";

async function joinGroup(socket: Socket, userId: string) {
  const userRooms = (await client.zrange(
    `user:${userId}:groups`,
    0,
    -1
  )) as string[];
  userRooms.forEach((roomId) => {
    socket.join(roomId);
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
        console.log(
          `User ${userId} already registered with socket ID: ${socket.id}`
        );
        await joinGroup(socket, userId);
      } catch (error) {
        console.error("Error registering user:", error);
      }
    });

    socket.on('typing', async ({ userId, toUserId }) => {
      const recipientSocketID = await client.hget("onlineUsers", toUserId);
      if (recipientSocketID) {
        io.to(recipientSocketID).emit('typing', { fromUserId: userId });
      }
    });

    socket.on('stop_typing', async ({ userId, toUserId }) => {
      const recipientSocketID = await client.hget("onlineUsers", toUserId);
      if (recipientSocketID) {
        io.to(recipientSocketID).emit('stop_typing', { fromUserId: userId });
      }
    });


    socket.on("newGroup", async ({ groupMembers, roomId }) => {
      for (const id of groupMembers) {
        const recipientSocketID = await client.hget("onlineUsers", id);
        if (recipientSocketID) {
          io.to(recipientSocketID).emit("groups");
          io.sockets.sockets.get(recipientSocketID)?.join(roomId);
        }
      }
    });

    socket.on("notificateGroup", async ({ groupMembers }) => {
      for (const id of groupMembers) {
        const recipientSocketID = await client.hget("onlineUsers", id);
        if (recipientSocketID) {
          io.to(recipientSocketID).emit("groups");
        }
      }
    });

    socket.on("leaveGroup", async ({ userId, roomId }) => {
      const recipientSocketID = await client.hget("onlineUsers", userId);
      if (recipientSocketID) {
        io.to(recipientSocketID).emit("groups");
        io.sockets.sockets.get(recipientSocketID)?.leave(roomId);
      }
    });

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
      const { chatType, recipientId } = data;

      if (chatType === "direct") {
        const recipientSocketID = await client.hget("onlineUsers", recipientId);
        if (recipientSocketID) {
          io.to(recipientSocketID).emit("messages");
        }
        socket.emit("messages");
      } else if (chatType === "group") {
        io.to(recipientId).emit("messages");
      }
    });

    socket.on("call-initiate", async ({ recipientId }) => {
      const recipientSocketID = await client.hget("onlineUsers", recipientId);
        if (recipientSocketID) {
          io.to(recipientSocketID).emit("call-initiate");
        }
    });

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      console.log("User joined room:", roomId);
    });

    socket.on("offer", ({ offer, roomId }) => {
      socket.to(roomId).emit("offer", { offer });
      console.log("Offer sent to", roomId);
    });

    socket.on("answer", ({ answer, roomId }) => {
      socket.to(roomId).emit("answer", { answer });
      console.log("Answer sent to", roomId);
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {
      socket.to(roomId).emit("ice-candidate", { candidate });
    });

    socket.on("hangup", ({ roomId }) => {
      socket.to(roomId).emit("hangup");
      socket.leave(roomId);
      console.log("Call ended in", roomId);
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
