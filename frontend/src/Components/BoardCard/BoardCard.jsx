import React from 'react';
import style from './BoardCard.module.css'
import {Link} from "react-router-dom";


const mbti_list = [
    'INTJ', 'ENTP', 'ENTJ', 'INTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
]
const BoardCard = ({mbti}) => {
    return (
        <>
            <div className={style.div}>
                <Link to={`/board/${mbti}/`}><h3>{mbti}</h3></Link>
            </div>
        </>
    )
}

const BoardCardList = () => {
    return (
        <>
            {mbti_list.map((mbti) => (
                <>
                    <BoardCard mbti={mbti}/>
                </>
            ))}
        </>
    )
}

export default BoardCardList;