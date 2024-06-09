import React, {useState, useRef, useEffect, useContext} from "react";
import Slider from 'react-slick';
import style from "./GameScript.module.css";
import {UserContext} from "../../userContext";
import { useGameContext} from "./GameProvider";


const TextSlider = ({ messages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const sliderRef = useRef(null);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(messages.length - 1);
        }
    }, [messages.length]);

    useEffect(() => {
        console.log('current message!!', messages)
    }, [messages]);

    return (
        <div style={{ width: '800px', margin: '0 auto' }}>
            <Slider ref={sliderRef} {...settings}>
                {messages.map((msg, index) => (
                    <div key={index} className={style.message}>
                        <pre>{msg.message}</pre>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const GameScript = () => {
    const currentUser = useContext(UserContext)
    const {socket} = useGameContext()
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)

    useEffect(() => {
    }, [messages]);

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

    return (
        <div className={style.container} ref={messagesEndRef}>
            <TextSlider messages={messages}/>
        </div>
    );
};

export default GameScript;
