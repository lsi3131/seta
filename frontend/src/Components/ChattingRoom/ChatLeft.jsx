import React, { useEffect, useState } from 'react'
import style from './ChattingRoom.module.css'

const ChatLeft = ({ host, members }) => {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
    })
    if (isLoading) {
        ;<div>Loding...</div>
    }
    return (
        <div className={style.Room_left_container}>
            <h2>참여자 목록</h2>
            <div className={style.chatMemberList}>
                {members.map((member, index) => (
                    <>
                        <div style={{ position: 'relative' }} key={index}>
                            {member === host ? (
                                <sup style={{ position: 'absolute', fontSize: 20, top: 0, right: 0 }}>👑</sup>
                            ) : null}
                            <a className={style.chatMembers} href={`/profile/${member}/`} target="_blank">
                                {member}
                            </a>
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}

export default ChatLeft
