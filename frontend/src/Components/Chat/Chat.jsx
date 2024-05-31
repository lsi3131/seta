// App.js

import React, {useState, useEffect} from 'react';
import {WebSocketProvider, useWebSocket} from './WebSocketProvider';

function ChatInner() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const {sendMessage} = useWebSocket();

    useEffect(() => {
        // WebSocket을 통해 메시지를 받는 부분
        const handleMessage = (event) => {
            const newMessage = JSON.parse(event.data).message;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        // WebSocket 연결
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/room/'); // Django Channels 웹 소켓 URL에 맞게 수
        socket.addEventListener('message', handleMessage);

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            socket.removeEventListener('message', handleMessage);
            socket.close();
        };
    }, []);

    const handleMessageSend = () => {
        sendMessage(message);
        setMessage('');
    };

    return (
        <div>
            <h1>채팅 애플리케이션</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleMessageSend}>전송</button>
        </div>
    );
}

const Chat = () => (
    <WebSocketProvider>
        <ChatInner/>
    </WebSocketProvider>
);

export default Chat;
