import React from 'react';
import style from './BoardDetail.module.css'
import {Link, useParams} from "react-router-dom";
import CommentBox from "../Comment/Comment";

const BoardDetail = () => {
    const {detailId} = useParams()

    return (
        <>
            <div className={style.vertical}>
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
