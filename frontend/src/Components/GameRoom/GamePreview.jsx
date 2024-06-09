import React from "react";
import style from "./GameIntroduce.module.css";
import {useGameContext} from "./GameProvider";
import GameIntroduce from "./GameIntroduce";


const GamePreview = () => {
    const {gameSetting} = useGameContext()

    return (
        <div className={style.container}>
            <GameIntroduce/>

            <div className={style.button_list}>
                <button>게임시작</button>
                <button>설정</button>
            </div>
        </div>
    )
};

export default GamePreview;
