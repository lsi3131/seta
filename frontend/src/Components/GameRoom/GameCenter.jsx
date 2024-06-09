import React, {useState} from "react";
import style from "./GameCenter.module.css";
import GameScript from "./GameScript";
import GameIntroduce from "./GameIntroduce";
import GameSettingModal from "./GameSettingModal";
import {useGameSetting} from "./GameSettingProvider";


const GameCenter = ({socket}) => {
    const {gameSetting, setShowSetting} = useGameSetting();


    return (
        <div className={style.container}>
            {gameSetting ? (
                <>
                    <GameIntroduce/>
                    <GameScript socket={socket}/>
                </>
            ): (
                <div className={style.gameSettingContainer} onClick={() => setShowSetting(true)}>
                    <h3>게임을 설정하고 싶으시면 클릭하세요</h3>
                </div>
            )}
        </div>
    );
};

export default GameCenter;
