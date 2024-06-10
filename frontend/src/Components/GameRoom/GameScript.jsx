import React, {useState, useRef, useEffect, useContext} from "react";
import Slider from 'react-slick';
import style from "./GameScript.module.css";
import {UserContext} from "../../userContext";
import {useGameContext} from "./GameProvider";
import TRPGGameUser from "./TRPGGameUser";

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
            if (messages.length > 0) {
                sliderRef.current.slickGoTo(messages.length);
            }
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
                <>게임 시작</>
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
    const {aiMessages, aiParty} = useGameContext()
    const messagesEndRef = useRef(null)

    useEffect(() => {
        console.log(aiMessages)
    }, [aiMessages]);

    return (
        <div className={style.container} ref={messagesEndRef}>
            <div className={style.userList}>
                {aiParty.map((user, index) => (
                    <div key={index}>
                        <TRPGGameUser user={user}/>
                    </div>
                ))}
            </div>
            <TextSlider messages={aiMessages}/>
        </div>
    );
};

export default GameScript;
