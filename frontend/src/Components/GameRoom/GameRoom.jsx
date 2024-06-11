import React, {useState, useEffect, useContext} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import style from './GameRoom.module.css'
import GameChat from "./GameChat";
import {GameProvider, useGameContext} from "./GameProvider";
import GameCenter from "./GameCenter";
import GameSettingModal from "./GameSettingModal";
import ReactLoading from 'react-loading';
import GameLeft from "./GameLeft";

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
    const {isLoading, isAISubmit, members, socket, host, showSettingModal} = useGameContext()

    useEffect(() => {
        console.log('is submit', isAISubmit)
    }, [isAISubmit]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {isAISubmit && (
                <div className={style.loadingContainer}>
                    <ReactLoading type="spin" color="#0000ff" height={50} width={50}/>
                </div>
                )}
            {showSettingModal && (<GameSettingModal/>)}
            <div className={style.Room_vertical}>
                <div className={style.Room_container}>
                    <div className={style.Room_left}>
                        <GameLeft members={members} host={host}/>
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
