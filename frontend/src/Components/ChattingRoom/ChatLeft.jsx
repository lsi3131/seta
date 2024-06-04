import React, { useEffect, useState } from 'react'
import style from './ChattingRoom.module.css'

const ChatLeft = ({ members }) => {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(false)
    })
    if (isLoading) {
        ;<div>Loding...</div>
    }
    return (
        <div className={style.Room_left_container}>
            <h2>참여자 목록</h2>
            <div className={style.chatMemberList}>
                {members.map((member, index) => (
                    <a className={style.chatMembers} href={`/profile/${member}/`} target="_blank" key={index}>
                        {member}
                    </a>
                ))}
            </div>
        </div>
    )
}

export default ChatLeft
