interface Message {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: string;
    type: "message" | "image";
}