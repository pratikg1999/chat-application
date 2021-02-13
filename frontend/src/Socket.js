import { io } from "socket.io-client";
export const SOCKET_URL = !process.env.REACT_APP_ENV
  ? "http://localhost:5000"
  : `${process.env.REACT_APP_ENV}`;
console.log(SOCKET_URL);
const Socket = {
  connect,
  emit,
  on,
  removeListener,
  removeAllListeners,
  close,
  socket: null,
};

function connect(connnectionUrl, userId) {
  Socket.socket = io(connnectionUrl, {
    path: "/socket.io/",
    forceNew: true,
    query: {
      userId: userId,
    },
  });
}

function on(eventName, callback) {
  if (Socket.socket) {
    Socket.socket.on(eventName, (data) => {
      callback(data);
    });
  }
}

function emit(eventName, ...args) {
  if (Socket.socket) {
    Socket.socket.emit(eventName, ...args);
  }
}

function removeListener(eventName) {
  if (Socket.socket) {
    Socket.socket.removeListener(eventName);
  }
}

function removeAllListeners() {
  if (Socket.socket) {
    Socket.socket.removeAllListeners();
  }
}

function close() {
  if (Socket.socket) {
    Socket.socket.close();
  }
}

export default Socket;
