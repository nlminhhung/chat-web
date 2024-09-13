import io from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'; // Replace with your server URL

const socket = io(SOCKET_URL);

export default socket;