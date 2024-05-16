import React from 'react';
import style from './Board.module.css'
import {Link, useParams} from "react-router-dom";

const Board = () => {
    const {mbti} = useParams()

    return (
        <>
            <div>
                <div className={style.horizontal}>
                    <div className={style.vertical}>
                        <h3>Hello {mbti}</h3>
                        <p>[[MBTI 별 특징을 기입한다]]</p>
                    </div>
                    <div className={style.divImage}>
                    </div>
                </div>

                <hr/>
                <div className={style.vertical}>
                    <Link to={`/board_detail/1`}>ISTP는 이쁜사람이 많은 가요?</Link>
                    <Link to={`/board_detail/2`}>--TP 특징</Link>
                </div>

                <hr/>

                <div style={{margin: "20px"}}>
                    <Link to={`/write`}>글쓰기</Link>
                </div>

                <Link to="/">뒤로</Link>
            </div>
        </>
    )
}
export default Board;
