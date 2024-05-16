import React, {useEffect, useState} from 'react';
import style from './Board.module.css'
import {Link, useParams} from "react-router-dom";
import axios from "axios";

function getUrl(subUrl) {
    const urlRoot = 'http://127.0.0.1:8000'
    return `${urlRoot}${subUrl}`
}

const Board = () => {
    const {mbti} = useParams()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const url = getUrl('/api/posts/mbti/intp/')
        console.log(url)
        axios.get(url)
            .then(response => {
                setPosts(response.data)
            }).catch(error => {
            console.error('Error during get posts:', error)
        })
    }, []);


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
                    {posts.map(post => (
                        <>
                            <Link to={`/board_detail/${post.id}`}>{post.title}</Link>
                        </>
                    ))
                    }
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
