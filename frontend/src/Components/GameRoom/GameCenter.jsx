import React, {useEffect, useState} from "react";
import style from "./GameCenter.module.css";
import GameScript from "./GameScript";
import {useGameContext} from "./GameProvider";
import GamePreview from "./GamePreview";
import image from "../../Assets/images/game/trpg_setting.png";


const GameCenter = () => {
    const {gameStep, setShowSettingModal} = useGameContext()

    useEffect(() => {

    }, [gameStep]);

    return (
        <div className={style.container}>
            {gameStep === 'wait_setting' && (
                <div className={style.gameSettingContainer} onClick={() => setShowSettingModal(true)}>
                    <img src={image} alt="trpg setting"/>
                    <h3>클릭하여 게임의 세계관을 생성하세요!</h3>
                </div>
            )}
            {gameStep === 'wait_start' && (
                <div>
                    <GamePreview/>
                </div>
            )}
            {gameStep === 'game_start' && (
                <div>
                    <GameScript/>
                </div>
            )}

        </div>
    );
};

export default GameCenter;
