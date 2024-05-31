// App.js
import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from "../../userContext";

function ChatInner() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const currentUser = useContext(UserContext);
    // const {sendMessage} = useWebSocket();

    useEffect(() => {
        // WebSocket을 통해 메시지를 받는 부분
        const handleMessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        // WebSocket 연결
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/room/'); // Django Channels 웹 소켓 URL에 맞게 수
        socket.addEventListener('message', handleMessage);

        setSocket(socket)

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            socket.removeEventListener('message', handleMessage);
            socket.close();
        };
    }, []);

    const handleMessageSend = () => {
        const sendData = {
            message: message,
            username: currentUser.username
        }

        sendMessage(sendData);
        setMessage('');
    };

    const sendMessage = (message) => {
        if (socket.readyState === WebSocket.OPEN) {
            const jsonMessage = JSON.stringify({message})
            socket.send(jsonMessage);
        }
    };


    return (
        <div>
            <h1>채팅 애플리케이션</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.username} : {msg.message}</div>
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
    <ChatInner/>
);

export default Chat;
