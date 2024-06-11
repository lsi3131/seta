import React, { useRef, useEffect} from "react";
import Slider from 'react-slick';
import style from "./GameScript.module.css";
import {useGameContext} from "./GameProvider";
import ReactLoading from "react-loading";
import TRPGGameUserList from "./TRPGGameUser";

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
    const {aiMessages, aiParty, isAISubmit, remainVoteSecond} = useGameContext()
    const messagesEndRef = useRef(null)

    useEffect(() => {
        console.log(aiMessages)
    }, [aiMessages]);

    return (
        <div className={style.containerWrapper}>
            {isAISubmit && (
                <div className={style.loadingContainer}>
                    <ReactLoading type="spin" color="#0000ff" height={50} width={50}/>
                </div>
            )}
            {/*<div className={style.countdown}>*/}
            {/*    <h3>투표까지 남은 시간 : </h3>*/}
            {/*    {remainVoteSecond && (*/}
            {/*        <span className="timer">{remainVoteSecond}초</span>*/}
            {/*    )}*/}
            {/*</div>*/}
            <div className={style.container} ref={messagesEndRef}>
                <TRPGGameUserList users={aiParty}/>
                <div className={style.textSlider}>
                    <TextSlider messages={aiMessages}/>
                </div>
            </div>
        </div>
    );
};

export default GameScript;
