import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "userContext";
import style from "./ProfileMyPost.module.css"
import apiClient from "services/apiClient";
import { Link } from "react-router-dom";
import { formatDate, getFontColor, getButtonColor } from "../../Utils/helpers"




const ProfileMyPost = (users) => {
    const [view, setView] = useState('posts')
    const user = users.props

    const [visivlePosts, setVisivlePosts] = useState(5)


    const MorePosts = () => {
        setVisivlePosts((prevVisiblePosts) => prevVisiblePosts + 5)
    }

    console.log(user)
    return (
        <div className={style.board_contents}>
            <div className={style.board_category}>
                <button onClick={() => setView('posts')}>내가 작성한 글</button>
                <button onClick={() => setView('like_posts')}>좋아요 한 글 </button>
            </div>
            <hr />
            {(view === 'posts' || view === 'like_posts') && user.posts && (
                <div key={user.id} className={style.board_posts}>
                    {(view === 'posts' ? user.posts : user.like_posts).map((post) => (
                        <>
                            <div key={post.id} className={style.board_post}>
                                <div className={style.board_post_left}>
                                    <div className={style.board_post_category}>
                                        <p style={{ color: getFontColor(user.mbti) }}>{post.category}</p>
                                    </div>
                                    <div key={post.id} className={style.board_post_title}>
                                        <Link to={`/detail/${post.id}`}>{post.title}</Link>
                                        <p style={{ color: getFontColor(user.mbti) }}>[{post.hits}]</p>
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
                                <div className={style.board_post_right}>
                                    <div >
                                        {post.mbti.map(m => (
                                            <p style={{ backgroundColor: getButtonColor(m) }}>{m}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    ))}
                </div>
            )}
        </div>
    )
}
export default ProfileMyPost



