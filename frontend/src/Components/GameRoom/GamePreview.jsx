import React, {useEffect} from "react";
import style from "./GamePreview.module.css";
import {useGameContext} from "./GameProvider";
import image from "../../Assets/images/game/trpg_setting.png";

const GamePreview = () => {
    const {gameSetting} = useGameContext()

    const {setGameStepSetting, startGame} = useGameContext()

    useEffect(() => {
    }, []);

    const handleGameStart = () => {
        const result = window.confirm("게임을 시작하시겠습니까?");
        if (result) {
            startGame()
        }
    }

    const handleSetting = () => {
        setGameStepSetting()
    }

    return (
        <div className={style.container}>
            <div className={style.previewContainer}>
                <h3>세계관</h3>
                <div className={style.instruction}>
                    <pre>{gameSetting['instruction']}</pre>
                </div>
                {/*<div className={style.gameSettingContainer}}>*/}
                {/*    <img src={image} alt="trpg setting"/>*/}
                {/*    <h3>클릭하여 게임의 세계관을 생성하세요!</h3>*/}
                {/*</div>*/}
            </div>

            <div className={style.button_container}>
                <button onClick={handleGameStart}>게임 시작</button>
                <button onClick={handleSetting}>다시 설정</button>
            </div>
        </div>
    )
};

export default GamePreview;
