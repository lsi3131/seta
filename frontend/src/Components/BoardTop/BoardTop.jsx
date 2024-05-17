import style from "./BoardTop.module.css";
import React from "react";
import {getImage, getMainColor} from "../../Utils/helpers";

const BoardTop = ({mbti, description}) => {
    return (
        <div className={style.board_top} style={{background: getMainColor(mbti)}}>
            <div className={style.board_top_text_container}>
                <h3>{mbti}</h3>
                <p>{description}</p>
            </div>
            <div className={style.board_top_image}>
                <img className={style.board_top_image_size} src={getImage(mbti)} alt=""/>
            </div>
        </div>
    )
}

export default BoardTop;
