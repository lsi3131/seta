import React from 'react';
import style from './BoardCard.module.css'
import {Link} from "react-router-dom";


const mbti_list = [
    { url: "http://via.placeholder.com/250x250", mbti: "INTJ"},
    { url: "http://via.placeholder.com/250x250", mbti: "ENTP"},
    { url: "http://via.placeholder.com/250x250", mbti: "ENTJ"},
    { url: "http://via.placeholder.com/250x250", mbti: "ENTP"},
    { url: "http://via.placeholder.com/250x250", mbti: "INFJ"},
    { url: "http://via.placeholder.com/250x250", mbti: "INFP"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ENFJ"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ENFP"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ISTJ"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ISFJ"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ESTJ"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ESFJ"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ISTP"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ISFP"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ESTP"}, 
    { url: "http://via.placeholder.com/250x250", mbti: "ESFP"}, 
]

const BoardCard = ({mbti}) => {
    return (
        <>
            <div className={style.div}>
                <Link to={`/board/${mbti.mbti}/`}>
                    <img src={mbti.url} alt={mbti.mbti} className={style.image}/>
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