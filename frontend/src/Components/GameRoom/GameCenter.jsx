import React, {useState} from "react";
import style from "./GameCenter.module.css";
import GameScript from "./GameScript";
import GameIntroduce from "./GameIntroduce";
import {useGameContext} from "./GameProvider";
import GamePreview from "./GamePreview";


const GameCenter = () => {
    const {gameStep, setShowSettingModal} = useGameContext()

    return (
        <div className={style.container}>
            {gameStep === 'wait_setting' && (
                <>
                    <div className={style.gameSettingContainer} onClick={() => setShowSettingModal(true)}>
                        <h3>게임을 설정하고 싶으시면 클릭하세요</h3>
                    </div>
                </>
            )}
            {gameStep === 'wait_start' && (
                <>
                    <GamePreview/>
                </>
            )}
            {gameStep === 'game_start' && (
                <>
                    <GameIntroduce/>
                    <GameScript/>
                </>
            )}

        </div>
    );
};

export default GameCenter;
