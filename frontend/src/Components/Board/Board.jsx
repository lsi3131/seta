import React from 'react';
import style from './Board.module.css'
import {Link, useParams} from "react-router-dom";
import intj from "Assets/images/intj.png"

const Board = () => {
    const {mbti} = useParams()

    //     const imagePaths = [
    //   '/images/image1.png',
    //   '/images/image2.png',
    //   '/images/image3.png',
    //   // 추가적인 이미지 경로들...
    // ];


    return (
        <>
            <div>
                <div className={style.horizontal}>
                    <div className={style.vertical}>
                        <h3>Hello {mbti}</h3>
                        <p>대담한 통솔가</p>
                    </div>
                    <div className={style.divImage}>
                        <img src={intj} alt=""/>
                    </div>
                </div>

                <Link to="/">뒤로 갑시다</Link>
            </div>
        </>
    )
}
export default Board;
