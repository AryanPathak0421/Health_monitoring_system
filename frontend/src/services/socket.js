import { io } from "socket.io-client";

// Dynamically connect to the same host as the frontend but on port 5000
const host = window.location.hostname;
const socket = io(`http://${host}:5000`);

export default socket;
