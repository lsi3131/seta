import React from "react";
import style from "./GameIntroduce.module.css";
import {useGameSetting} from "./GameSettingProvider";


const GameIntroduce = ({socket}) => {
    const {gameSetting} = useGameSetting();

    return (
        <div className={style.container}>
            {gameSetting && (
                <>
                    <h2>{gameSetting['title']}</h2>
                    <h3>{gameSetting['description']}</h3>
                </>
            )}
        </div>
    )
};

export default GameIntroduce;
