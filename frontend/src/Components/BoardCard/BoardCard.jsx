import React from 'react';
import style from './BoardCard.module.css'
import {Link} from "react-router-dom";


const mbti_list = [
    { url: require("../../Assets/images/card_INTJ.png"), mbti: "INTJ"},
    { url: require("../../Assets/images/card_INTP.png"), mbti: "INTP"},
    { url: require("../../Assets/images/card_ENTP.png"), mbti: "ENTP"},
    { url: require("../../Assets/images/card_ENTJ.png"), mbti: "ENTJ"},
    { url: require("../../Assets/images/card_INFJ.png"), mbti: "INFJ"},
    { url: require("../../Assets/images/card_INFP.png"), mbti: "INFP"}, 
    { url: require("../../Assets/images/card_ENFJ.png"), mbti: "ENFJ"}, 
    { url: require("../../Assets/images/card_ENFP.png"), mbti: "ENFP"}, 
    { url: require("../../Assets/images/card_ISTJ.png"), mbti: "ISTJ"}, 
    { url: require("../../Assets/images/card_ISFJ.png"), mbti: "ISFJ"}, 
    { url: require("../../Assets/images/card_ESTJ.png"), mbti: "ESTJ"}, 
    { url: require("../../Assets/images/card_ESFJ.png"), mbti: "ESFJ"}, 
    { url: require("../../Assets/images/card_ISTP.png"), mbti: "ISTP"}, 
    { url: require("../../Assets/images/card_ISFP.png"), mbti: "ISFP"}, 
    { url: require("../../Assets/images/card_ESTP.png"), mbti: "ESTP"}, 
    { url: require("../../Assets/images/card_ESFP.png"), mbti: "ESFP"}, 
]

const BoardCard = ({mbti}) => {
    return (
        <>
            <div className={style.div}>
                <Link to={`/board/${mbti.mbti}/`}>
                    <img src={mbti.url} alt="http://via.placeholder.com/250x250" className={style.image}/>
                </Link>
            </div>
        </>
    )
}

const BoardCardList = () => {
    return (
        <div className={style.container}>
            <div className={style.cardList}>
                {mbti_list.map((mbti) => (
                    <>
                        <BoardCard mbti={mbti}/>
                    </>
                ))}
            </div>
        </div>
    )
}

export default BoardCardList;