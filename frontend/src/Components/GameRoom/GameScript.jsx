import React, {useState, useRef, useEffect, useContext} from "react";
import Slider from 'react-slick';
import style from "./GameScript.module.css";
import {UserContext} from "../../userContext";
import {useGameContext} from "./GameProvider";
import TRPGGameUser from "./TRPGGameUser";


const trpgUsers = [
    {name: '승협', str: 10, int: 5, cha: 15},
    {name: '상일', str: 15, int: 5, cha: 10},
    {name: '준서', str: 5, int: 15, cha: 15},
    {name: '병민', str: 5, int: 15, cha: 15},
]

const TextSlider = ({messages}) => {
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

    const getScript = (message) => {
        return message['script']
    }

    return (
        <div className={style.sliderContainer}>
            <Slider ref={sliderRef} {...settings}>
                {messages.map((msg, index) => (
                    <div key={index} className={style.message}>
                        <pre>{getScript(msg.message)}</pre>
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
    const [party, setParty] = useState([])

    useEffect(() => {
        console.log(messages)
    }, [messages]);

    useEffect(() => {
        if (!currentUser || !socket) return

        // WebSocket을 통해 메시지를 받는 부분
        const handleMessage = (event) => {
            const newMessage = JSON.parse(event.data)
            console.log('new message', newMessage, newMessage['message']['party'])
            const handleMessageList = ['ai_message']
            const messageType = newMessage['message_type']
            if (handleMessageList.includes(messageType)) {
                setMessages((prevMessages) => [...prevMessages, newMessage])
                setParty(newMessage['message']['party'])
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
            <div className={style.userList}>
                {party.map((user, index) => (
                    <div key={index}>
                         <TRPGGameUser user={user}/>
                    </div>
                ))}
            </div>
            <TextSlider messages={messages}/>
        </div>
    );
};

export default GameScript;
