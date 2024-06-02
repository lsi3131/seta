import React, { useState, useRef, useEffect } from "react";
import style from "./ChattingRoom.module.css";
import ChatRightBottom from "./ChatRightbottom";
import ChatRightTop from "./ChatRightTop"

const ChatRoom = () => {
    

    return (
        <div className={style.Room_vertical}>
            <div className={style.Room_container}>
                <div className={style.Room_left}>
                    
                </div>
                <div className={style.Room_right}>
                    <ChatRightTop />
                    <ChatRightBottom />
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
