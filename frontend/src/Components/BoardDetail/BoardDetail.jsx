import React from 'react';
import style from './BoardDetail.module.css'
import {Link, useLocation, useParams} from "react-router-dom";
import CommentBox from "../Comment/Comment";
import BoardTop from "../BoardTop/BoardTop"

const BoardDetail = () => {
    const {detailId} = useParams()
    const location = useLocation();
    const { mbti } = location.state || {};

    console.log('hello', mbti);

    return (
        <>
            <div className={style.vertical}>
                <BoardTop mbti={mbti}/>
                <h3>TP 특징- {detailId}</h3>
                <hr/>

                <p>
                    1. 외모가 수려하다.
                </p>

                <hr/>

                <CommentBox/>

            </div>
        </>
    )
}
export default BoardDetail;
