interface Message {
    messageId: string;
    senderId: string;
    name: string;
    senderImage: string
    content: string;
    timestamp: string;
    type: "message" | "image";
}