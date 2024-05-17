import React, {useEffect, useState} from 'react';
import style from './Board.module.css'
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import enfj from "../../Assets/images/enfj.jpg"

function getUrl(subUrl) {
    const urlRoot = 'http://127.0.0.1:8000'
    return `${urlRoot}${subUrl}`
}

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
        image: require("../../Assets/images/esfj.jpg"), mainColor: "#72C9CB",
        fontColor: "#72C9CB", buttonColor: "#72C9CB"
    },
    "isfj": {
        image: require("../../Assets/images/isfj.jpg"), mainColor: "#72C9CB",
        fontColor: "#72C9CB", buttonColor: "#72C9CB"
    },
    "istj": {
        image: require("../../Assets/images/istj.jpg"), mainColor: "#72C9CB",
        fontColor: "#72C9CB", buttonColor: "#72C9CB"
    },
    "estj": {
        image: require("../../Assets/images/estj.jpg"), mainColor: "#72C9CB",
        fontColor: "#72C9CB", buttonColor: "#72C9CB"
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
const getFontColor = (mbti) => {
    return mbtiParams[mbti.toLowerCase()].fontColor
}

const getButtonColor = (mbti) => {
    return mbtiParams[mbti.toLowerCase()].buttonColor
}

const BoardTop = ({mbti}) => {
    return (
        <div className={style.boardTop} style={{background: getMainColor(mbti)}}>
            <div>
                <h3>{mbti}</h3>
                <p>뜨거운 논쟁을 즐기는 사색가</p>
            </div>
            <div>
                <img className={style.img_size} src={getImage(mbti)} alt=""/>
            </div>
        </div>
    )
}

const BoardPost = ({post, mbti}) => {
    return (
        <>
            <div className={style.board_post}>
                <div className={style.board_post_left}>
                    <div className={style.board_post_category}>
                        <p style={{color: getFontColor(mbti)}}>{post.category}</p>
                    </div>
                    <div className={style.board_post_title}>
                    <Link to={`/detail/${post.id}`}>{post.title}</Link>
                        <p style={{color: getFontColor(mbti)}}>[{post.hits}]</p>
                    </div>
                    <div className={style.board_post_bottom}>
                        <div>
                            <p>{post.author}</p>
                        </div>
                        <div>
                            <p>{post.created_at}</p>
                        </div>
                        <div className={style.horizontal}>
                            <p>좋아요</p>
                            <p>{post.likes}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.horizontal}>
                        {post.mbti.map(m => (
                            <p>{m}</p>
                        ))}
                    </div>
                </div>
            </div>
            <hr/>
        </>
    )
}

const BoardPostList = ({mbti}) => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const mbtiLower = mbti.toLowerCase()
        const url = getUrl(`/api/posts/mbti/${mbtiLower}/`)
        console.log(url)
        axios.get(url)
            .then(response => {
                setPosts(response.data)
            }).catch(error => {
            console.error('Error during get posts:', error)
        })
    }, [mbti]);

    return (
        <div className={style.vertical}>
            {posts.map(post => (
                <>
                    <BoardPost post={post} mbti={mbti}/>
                </>
            ))}
        </div>
    );
}

const BoardCategory = () => {
    return (
        <div>
            <div className={style.board_category}>
                <div className={style.horizontal}>
                    <p>전체글</p>
                    <p>질문있어요</p>
                    <p>유머</p>
                    <p>창작</p>
                </div>
                <div className={style.horizontal}>
                    <p>최신순</p>
                    <p>추천순</p>
                    <p>댓글순</p>
                </div>
            </div>
            <hr className={style.thick_line}/>
        </div>
    );
}


const BoardPostBox = ({mbti}) => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const mbtiLower = mbti.toLowerCase()
        const url = getUrl(`/api/posts/mbti/${mbtiLower}/`)
        console.log(url)
        axios.get(url)
            .then(response => {
                setPosts(response.data)
            }).catch(error => {
            console.error('Error during get posts:', error)
        })
    }, [mbti]);

    return (
        <>
            <BoardCategory/>
            <BoardPostList mbti={mbti}/>
        </>
    );
}


const Board = () => {
    const {mbti} = useParams()

    return (
        <>
            <div>
                <BoardTop mbti={mbti}/>

                <BoardPostBox mbti={mbti}/>

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
