import style from "./Profile.module.css";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {formatDate} from "../../Utils/helpers"

// function getUrl(subUrl) {
//     const urlRoot = 'http://127.0.0.1:8000'
//     return `${urlRoot}${subUrl}`
// }

const Profile = () => {
    const [users, setUsers] = useState({})
    const [view, setView] = useState('posts')
    const [visivlePosts, setVisivlePosts] = useState(5)

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('http://127.0.0.1:8000/api/accounts/alicia46/')
            console.log(response.data.posts)
            setUsers(response.data)
        }
        fetchData();
    }, []);

    const MorePosts = () => {
        setVisivlePosts((prevVisiblePosts) => prevVisiblePosts + 5)
    }

    const mbtiParams = {
        "intj": {
            image: require("../../Assets/images/intj.jpg"),
            fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
        },
        "intp": {
            image: require("../../Assets/images/intp.jpg"),
            fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
        },
        "entj": {
            image: require("../../Assets/images/entj.jpg"),
            fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
        },
        "entp": {
            image: require("../../Assets/images/entp.jpg"),
            fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
        },
        "esfp": {
            image: require("../../Assets/images/esfp.jpg"),
            fontColor: "#FFA800", buttonColor: "#FFA800"
        },
        "estp": {
            image: require("../../Assets/images/estp.jpg"),
            fontColor: "#FFA800", buttonColor: "#FFA800"
        },
        "isfp": {
            image: require("../../Assets/images/isfp.jpg"),
            fontColor: "#FFA800", buttonColor: "#FFA800"
        },
        "istp": {
            image: require("../../Assets/images/istp.jpg"),
            fontColor: "#FFA800", buttonColor: "#FFA800"
        },
        "esfj": {
            image: require("../../Assets/images/esfj.jpg"),
            fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
        },
        "isfj": {
            image: require("../../Assets/images/isfj.jpg"),
            fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
        },
        "istj": {
            image: require("../../Assets/images/istj.jpg"),
            fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
        },
        "estj": {
            image: require("../../Assets/images/estj.jpg"),
            fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
        },
        "infj": {
            image: require("../../Assets/images/infj.jpg"),
            fontColor: "#73C964", buttonColor: "#73C964"
        },
        "infp": {
            image: require("../../Assets/images/infp.jpg"),
            fontColor: "#73C964", buttonColor: "#73C964"
        },
        "enfj": {
            image: require("../../Assets/images/enfj.jpg"),
            fontColor: "#73C964", buttonColor: "#73C964"
        },
        "enfp": {
            image: require("../../Assets/images/enfp.jpg"),
            fontColor: "#73C964", buttonColor: "#73C964"
        },
    }

    const getImage = (mbti) => {
        if (!mbti) return null;
        return mbtiParams[mbti.toLowerCase()].image;
    }

    const getFontColor = (mbti) => {
        if (!mbti) return null;
        return mbtiParams[mbti.toLowerCase()].fontColor
    }

    const getButtonColor = (mbti) => {
        return mbtiParams[mbti.toLowerCase()].buttonColor
    }

    return (
        <div className={style.vertical}>
            <div className={style.board_top} >
                <div className={style.board_top_content}>
                    <div className={style.board_top_lift}>
                        <div className={style.board_top_text_container}>
                            <p>{users.mbti}</p>
                            <h2>{users.username}</h2>
                        </div>
                        <div>
                            <img className={style.board_top_image} src={getImage(users.mbti)} />
                        </div>
                    </div>
                    <div className={style.board_top_right}>
                        <div className={style.board_top_count}>
                            <div>
                                {users.posts && <h2>{users.posts.length}</h2>}
                                <p>게시물</p>
                            </div>
                            <div>
                                <h2>{users.followers_count}</h2>
                                <p>팔로워</p>
                            </div>
                            <div>
                                <h2>{users.following_count}</h2>
                                <p>팔로잉</p>
                            </div>
                        </div>
                        <div className={style.boder_top_mbti_box}>
                            {users.mbti &&
                                <div className={style.board_top_mbti}>
                                    <h3>{users.mbti[0]}</h3>
                                    <p>{Math.floor(users.percentIE)}%</p>
                                    <h3>{users.mbti[1]}</h3>
                                    <p>{Math.floor(users.percentNS)}%</p>
                                    <h3>{users.mbti[2]}</h3>
                                    <p>{Math.floor(users.percentFT)}%</p>
                                    <h3>{users.mbti[3]}</h3>
                                    <p>{Math.floor(users.percentPJ)}%</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.board_content}>
                <div className={style.board_category}>
                    <button onClick={() => setView('posts')}>내가 작성한 글</button>
                    <button onClick={() => setView('like_posts')}>좋아요 한 글 </button>
                </div>
                <hr />
                {view === 'posts' && users.posts && (
                    <div className={style.board_posts}>
                        {users.posts.slice(0, visivlePosts).map((post) => (
                            <>
                            <div className={style.board_post}>
                                <div className={style.board_post_left}>
                                    <div className={style.board_post_category}>
                                        <p style={{ color: getFontColor(users.mbti) }}>{post.category}</p>
                                    </div>
                                    <div key={post.id} className={style.board_post_title}>
                                        <Link to={`/detail/${post.id}`}>{post.title}</Link>
                                        <p style={{ color: getFontColor(users.mbti) }}>[{post.hits}]</p>
                                    </div>
                                    <div className={style.board_post_bottom}>
                                        <div>
                                            <p>{post.author}</p>
                                        </div>
                                        <div>
                                            <p>{formatDate(post.created_at)}</p>
                                        </div>
                                        <div className={style.board_like}>
                                            <p>좋아요 {post.likes}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className={style.board_post_right}>
                                        {post.mbti.map(m => (
                                            <p style={{ backgroundColor: getButtonColor(m) }}>{m}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            </>
                        ))}
                        {visivlePosts < users.posts.length && (
                            <button className={style.morebutton}onClick={MorePosts}>더보기</button>
                        )}
                    </div>
                )}
                {view === 'like_posts' && users.like_posts && (
                    <div className={style.posts}>
                        {users.like_posts.slice(0, visivlePosts).map((post) => (
                            <div key={post.id} className={style.post}>
                                <Link to={`/detail/${post.id}`}>{post.title}</Link>
                            </div>
                        ))}
                        {visivlePosts < users.like_posts.length && (
                            <button onClick={MorePosts}>더보기</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile;