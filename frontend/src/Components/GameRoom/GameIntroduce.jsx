import React from "react";
import style from "./GameIntroduce.module.css";
import {useGameContext} from "./GameProvider";


const GameIntroduce = () => {
    const {gameSetting} = useGameContext()

    return (
        <div className={style.container}>
            {gameSetting && (
                <>
                    <h2>{gameSetting['title']}</h2>
                    <h3>{gameSetting['instruction']}</h3>
                </>
            )}
        </div>
    )
};

export default GameIntroduce;
