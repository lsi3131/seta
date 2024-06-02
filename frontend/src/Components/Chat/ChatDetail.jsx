import React from "react"
import style from './ChatDetail.module.css'
const ChatDetail = () => {

    return (
        <div className={style.container}>
            <div className={style.leftContainer}>
                유저
            </div>
            <div className={style.rightContainer}>
                <div className={style.rightTopContainer}>
                    <h1>게임 인터페이스</h1>
                </div>
                <div className={style.rightBottomContainer}>
                    채팅
                </div>
            </div>
        </div>
    )
}
export default ChatDetail