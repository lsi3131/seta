import React, {useEffect} from "react";
import style from "./GamePreview.module.css";
import {useGameContext} from "./GameProvider";


const GamePreview = () => {
    const {gameSetting} = useGameContext()

    const {setShowSettingModal, startGame} = useGameContext()

    useEffect(() => {
    }, []);

    const handleGameStart = () => {
        startGame()
    }

    const handleSetting = () => {
        setShowSettingModal(true)
    }

    return (
        <div className={style.container}>
            <div className={style.previewContainer}>
                <div className={style.title}>
                    <h2>{gameSetting['title']}</h2>
                </div>
                <div className={style.instruction}>
                    <pre>{gameSetting['instruction']}</pre>
                </div>
            </div>

            <div className={style.button_container}>
                <button onClick={handleGameStart}>게임 시작</button>
                <button onClick={handleSetting}>다시 설정</button>
            </div>
        </div>
    )
};

export default GamePreview;
