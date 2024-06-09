import React from "react";
import style from "./GameCenter.module.css";
import GameScript from "./GameScript";
import GameIntroduce from "./GameIntroduce";


const GameCenter = ({socket}) => {
    return (
        <div className={style.container}>
            <GameIntroduce/>
            <GameScript socket={socket}/>
        </div>
    );
};

export default GameCenter;
