import React, {useState, useRef, useEffect, useContext} from "react";
import Slider from 'react-slick';
import style from "./GameScript.module.css";
import {UserContext} from "../../userContext";
import {useGameContext} from "./GameProvider";
import TRPGGameUser from "./TRPGGameUser";
import ReactLoading from "react-loading";

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
                <></>
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
    const {aiMessages, aiParty, isAISubmit} = useGameContext()
    const messagesEndRef = useRef(null)

    useEffect(() => {
        console.log(aiMessages)
    }, [aiMessages]);

    return (
        <div>
            {isAISubmit && (
                <div className={style.loadingContainer}>
                    <ReactLoading type="spin" color="#0000ff" height={50} width={50}/>
                </div>
                )}
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
        </div>
    );
};

export default GameScript;
