import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useQueueSocket(loketId) {
  const [socketData, setSocketData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!loketId) return;

    // Initialize socket connection
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      setIsConnected(true);
      // Join the room for this specific loket
      socket.emit('join_loket', loketId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for queue updates
    socket.on('queue:update', (data) => {
      setSocketData(data);
    });

    // Cleanup on unmount or when loketId changes
    return () => {
      socket.disconnect();
    };
  }, [loketId]);

  return { isConnected, socketData };
}
