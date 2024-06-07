import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

const WebSocketContext = createContext(null);

export const GameWebSocketProvider = ({ children, roomId }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState(null);
  const clientId = useRef(uuidv4());  // 고유 식별자 생성

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/draw/${roomId}/`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWs(socket);
    };

    socket.onclose = () => console.log('WebSocket disconnected');

    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessage(message);
    };

    return () => socket.close();
  }, []);

  const sendMessage = (message) => {
    if (ws) {
      ws.send(JSON.stringify({ ...message, clientId: clientId.current }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, message, clientId: clientId.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
