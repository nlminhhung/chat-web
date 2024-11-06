interface Message {
    senderId: string;
    content: string;
    timestamp: string;
    type: "message" | "image";
}