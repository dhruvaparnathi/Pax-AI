import { io } from 'socket.io-client';

let socket = null;

export const initializeSocketConnection = () => {
    if (!socket) {
        socket = io("http://localhost:3000", {
            withCredentials: true,
            autoConnect: false
        });

        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const getSocket = () => socket;