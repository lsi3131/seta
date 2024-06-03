import React, {useState, useRef, useEffect, useContext} from "react";
import style from "./ChattingRoom.module.css";
import {UserContext} from "../../userContext";

const ChatRightBottom = ({roomName = 'room_name'}) => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);
    const [rows, setRows] = useState(1);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const currentUser = useContext(UserContext);

    useEffect(() => {
        // WebSocket을 통해 메시지를 받는 부분
        const handleMessage = (event) => {
            console.log(event.data)
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        const url = `ws://127.0.0.1:8000/ws/chat/${roomName}/`

        // WebSocket 연결
        const socket = new WebSocket(url); // Django Channels 웹 소켓 URL에 맞게 수
        socket.addEventListener('message', handleMessage);

        setSocket(socket)

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            socket.removeEventListener('message', handleMessage);
            socket.close();
        };
    }, []);


    useEffect(() => {
        const adjustTextareaHeight = () => {
            const textarea = textareaRef.current;
            console.log(textarea)
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        adjustTextareaHeight();
    }, [text]);

    const sendMessage = (message) => {
        if (socket.readyState === WebSocket.OPEN) {
            const jsonMessage = JSON.stringify({message})
            socket.send(jsonMessage);
        }
    };

    const handleTextChange = (e) => {
        const lines = e.target.value.split('\n').length;
        console.log(lines)
        if (lines > 15) {
            e.preventDefault();
            return;
        }
        setText(e.target.value);
        setRows(lines)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sendData = {
            message: text,
            username: currentUser.username
        }

        sendMessage(sendData);
        setSubmittedText(text);
        setText("");
        setRows(1);
    };

    return (
        <div className={style.Room_right_bottom}>
            <div className={style.Room_bottom_content}>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>{msg.username} : {msg.message}</div>
                    ))}
                </div>
            </div>
            <div className={style.Room_bottom_submit}>
                <form action="#" className={style.Room_bottom_submit_form} onSubmit={handleSubmit}>
                    <textarea
                        ref={textareaRef}
                        className={style.Room_bottom_submit_textarea}
                        value={text}
                        onChange={handleTextChange}
                        placeholder="내용을 입력하세요"
                        rows={rows}
                    ></textarea>
                    <button className={style.Room_bottom_submit_button} type="submit">
                        &#10145;
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRightBottom;
