import React, {useState, useEffect, useContext} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import style from './GameRoom.module.css'
import ChatLeft from '../ChattingRoom/ChatLeft'
import GameChat from "./GameChat";
import {GameProvider, useGameContext} from "./GameProvider";
import GameCenter from "./GameCenter";
import GameSettingModal from "./GameSettingModal";

const GameRoom = () => {
    const location = useLocation()
    const {roomId} = useParams()
    const [password, setPassword] = useState(location.state?.password || '')

    return (
        <GameProvider roomId={roomId} initPassword={password}>
            <GameRoomContainer/>
        </GameProvider>
    )
}

const GameRoomContainer = () => {
    const {isLoading, members, socket, host, showSettingModal} = useGameContext()

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {showSettingModal && (<GameSettingModal/>)}
            <div className={style.Room_vertical}>
                <div className={style.Room_container}>
                    <div className={style.Room_left}>
                        <ChatLeft members={members} host={host}/>
                    </div>
                    <div className={style.Room_center}>
                        <GameCenter/>
                    </div>
                    <div className={style.Room_right}>
                        <GameChat members={members} socket={socket}/>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default GameRoom
