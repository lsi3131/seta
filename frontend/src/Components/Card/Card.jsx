import React from 'react';
import style from './Card.module.css'
import {Link} from "react-router-dom";


const mbti_list = [
    'INTJ', 'ENTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
]
const Card = ({mbti}) => {
    return (
        <>
            <div className={style.div}>
                <Link to={`/board/${mbti}/`}><h3>Board-{mbti}</h3></Link>
            </div>
        </>
    )
}

const CardList = () => {
    return (
        <>
            {mbti_list.map((mbti) => (
                <>
                    <Card mbti={mbti}/>
                </>
            ))}
        </>
    )
}

export default CardList;