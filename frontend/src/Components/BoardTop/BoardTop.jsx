import style from "../Board/Board.module.css";
import React from "react";
import Board from "../Board/Board";

const mbtiParams = {
    "intj": {
        image: require("../../Assets/images/intj.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "intp": {
        image: require("../../Assets/images/intp.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "entj": {
        image: require("../../Assets/images/entj.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "entp": {
        image: require("../../Assets/images/entp.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "esfp": {
        image: require("../../Assets/images/esfp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "estp": {
        image: require("../../Assets/images/estp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "isfp": {
        image: require("../../Assets/images/isfp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "istp": {
        image: require("../../Assets/images/istp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "esfj": {
        image: require("../../Assets/images/esfj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "isfj": {
        image: require("../../Assets/images/isfj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "istj": {
        image: require("../../Assets/images/istj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "estj": {
        image: require("../../Assets/images/estj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "infj": {
        image: require("../../Assets/images/infj.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "infp": {
        image: require("../../Assets/images/infp.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "enfj": {
        image: require("../../Assets/images/enfj.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "enfp": {
        image: require("../../Assets/images/enfp.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
}

const getImage = (mbti) => {
    return mbtiParams[mbti.toLowerCase()].image
}

const getMainColor = (mbti) => {
    return mbtiParams[mbti.toLowerCase()].mainColor
}

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
