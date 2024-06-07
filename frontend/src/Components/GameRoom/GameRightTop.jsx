import React, {useState, useRef, useEffect, useContext} from "react";
import style from "./GameRightTop.module.css";
import {UserContext} from "../../userContext";


const GameRightTop = ({socket}) => {
    const currentUser = useContext(UserContext)
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)


    useEffect(() => {
        if (!currentUser || !socket) return

        // WebSocket을 통해 메시지를 받는 부분
        const handleMessage = (event) => {
            const newMessage = JSON.parse(event.data)
            const handleMessageList = ['ai_message']
            const messageType = newMessage['message_type']
            if (handleMessageList.includes(messageType)) {
                setMessages((prevMessages) => [...prevMessages, newMessage])
            }
        }

        socket.addEventListener('message', handleMessage)

        // 컴포넌트 언마운트 시 WebSocket 이벤트 리스너 제거
        return () => {
            socket.removeEventListener('message', handleMessage)
        }
    }, [currentUser, socket])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
    }, [messages])


    return (
        <div className={style.container} ref={messagesEndRef}>
            {messages.map((msg, index) => (
                <div key={index} className={style.message}>
                    <hr/>
                    <pre>{msg.message}</pre>
                </div>
            ))}
        </div>
    );
};

export default GameRightTop;
