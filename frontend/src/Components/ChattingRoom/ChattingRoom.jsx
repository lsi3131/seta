import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import style from './ChattingRoom.module.css'
import ChatRightBottom from './ChatRightbottom'
import ChatRightTop from './ChatRightTop'

const ChatRoom = () => {
    const { roomId } = useParams()

    return (
        <div className={style.Room_vertical}>
            <div className={style.Room_container}>
                <div className={style.Room_left}></div>
                <div className={style.Room_right}>
                    <ChatRightTop />
                    <ChatRightBottom roomId={roomId} />
                </div>
            </div>
        </div>
    )
}

export default ChatRoom
