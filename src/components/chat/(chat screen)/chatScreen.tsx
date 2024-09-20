// "use client";
// import {
//   Avatar,
//   AvatarImage,
//   AvatarFallback,
// } from "@/src/components/chat/ui/avatar";
// import { Button } from "@/src/components/chat/ui/button";
// import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
// import { Input } from "@/src/components/chat/ui/input";

// interface Message {
//     id: number
//     sender: "friend" | "user"
//     name: string
//     content: string
//     avatar: string
//     timestamp: string
//   }
  
//   const messages: Message[] = [
//     {
//       id: 1,
//       sender: "friend",
//       name: "Alice",
//       content: "Hey there! How's it going?",
//       avatar: "/placeholder.svg?height=40&width=40",
//       timestamp: "10:30 AM"
//     },
//     {
//       id: 2,
//       sender: "user",
//       name: "You",
//       content: "Hi Alice! I'm doing great, thanks for asking. How about you?",
//       avatar: "/placeholder.svg?height=40&width=40",
//       timestamp: "10:32 AM"
//     },
//     {
//       id: 3,
//       sender: "friend",
//       name: "Alice",
//       content: "I'm good too! Just working on some projects. Anything exciting happening on your end?",
//       avatar: "/placeholder.svg?height=40&width=40",
//       timestamp: "10:35 AM"
//     },
//     {
//       id: 4,
//       sender: "user",
//       name: "You",
//       content: "Actually, yes! I'm planning a trip next month. It's been a while since I've traveled.",
//       avatar: "/placeholder.svg?height=40&width=40",
//       timestamp: "10:38 AM"
//     }
//   ]

// export default function ChatScreen2() {
//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="flex-grow flex justify-center">
//         <div className="w-full max-w-2xl bg-white shadow-lg flex flex-col"></div>
//         <ScrollArea className="flex-grow p-4">
//             <div className="space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`flex flex-col ${
//                       message.sender === "user" ? "items-end" : "items-start"
//                     } max-w-[70%] sm:max-w-[60%]`}
//                   >
//                     <div className="flex items-center space-x-2 mb-1">
//                       {message.sender === "friend" && (
//                         <Avatar className="w-6 h-6">
//                           <AvatarImage src={message.avatar} alt={message.name} />
//                           <AvatarFallback>{message.name[0]}</AvatarFallback>
//                         </Avatar>
//                       )}
//                       <span className="font-semibold text-sm">{message.name}</span>
//                       {message.sender === "user" && (
//                         <Avatar className="w-6 h-6">
//                           <AvatarImage src={message.avatar} alt={message.name} />
//                           <AvatarFallback>{message.name[0]}</AvatarFallback>
//                         </Avatar>
//                       )}
//                     </div>
//                     <div
//                       className={`p-3 rounded-lg ${
//                         message.sender === "user"
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-200 text-gray-800"
//                       }`}
//                     >
//                       {message.content}
//                     </div>
//                     <div className="flex items-center mt-1 text-xs text-gray-500">
//                       {/* <Clock className="w-3 h-3 mr-1" /> */}
//                       {message.timestamp}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//           <div className="p-4 border-t">
//             <form className="flex space-x-2">
//               <Input className="flex-grow" placeholder="Type a message..." />
//               <Button type="submit" size="icon">
//                 {/* <Send className="h-4 w-4" /> */}
//                 <span className="sr-only">Send</span>
//               </Button>
//             </form>
//           </div>
//       </div>
//     </div>
//   );
// }

// function VideoIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
//       <rect x="2" y="6" width="14" height="12" rx="2" />
//     </svg>
//   );
// }

// function MoveHorizontalIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polyline points="18 8 22 12 18 16" />
//       <polyline points="6 8 2 12 6 16" />
//       <line x1="2" x2="22" y1="12" y2="12" />
//     </svg>
//   );
// }

// function PhoneIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//     </svg>
//   );
// }
