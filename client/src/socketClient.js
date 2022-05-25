// or with import syntax
import { io } from "socket.io-client";

const socket = io.connect('http://localhost:3000',
{ upgrade: false, transports: ['websocket'], reconnection: false, forceNew: true });