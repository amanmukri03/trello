import { io } from "socket.io-client";

const socket = io("https://trello-backend-ed3n.onrender.com", {
  transports: ["websocket"],
  withCredentials: true
});

export default socket;
