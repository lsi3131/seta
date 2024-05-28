import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import style from "./Board.module.css";
import {formatDateDayBefore, getButtonColor, getFontColor} from "../../Utils/helpers";

const BoardPost = ({post}) => {
    const navigate = useNavigate()

    const handleMoveToPostMbti = (postMbti) => {
        navigate(`/board/${postMbti}/`)
    }

    return (
        <>
            <div className={style.board_post}>
                <div className={style.board_post_left}>
                    <div className={style.board_post_category}>
                        <p style={{color: getFontColor(post.post_mbti)}}>{post.category}</p>
                    </div>
                    <div className={style.board_post_title}>
                        <Link to={`/detail/${post.id}?mbti=${post.post_mbti}`}>{post.title}</Link>
                        <p style={{color: getFontColor(post.post_mbti)}}>[{post.comments}]</p>
                    </div>
                    <div className={style.board_post_bottom}>
                        <div>
                            <p>{post.author}</p>
                        </div>
                        <div>
                            <p>{formatDateDayBefore(post.created_at)}</p>
                        </div>
                        <div className={style.board_like}>
                            <p>좋아요</p>
                            <p>{post.likes}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.board_post_right}>
                        {post.mbti.map((m) => (
                            <button
                                onClick={() => handleMoveToPostMbti(m)}
                                style={{backgroundColor: getButtonColor(m)}}
                            >
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <hr/>
        </>
    )
}

const BoardPostList = ({mbti, posts}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [posts])

    return (
        <div>
            {posts.map((post) => (
                <>
                    <BoardPost post={post} mbti={mbti}/>
                </>
            ))}
        </div>
    )
}

const BoardPostBox = ({mbti, posts}) => {
    return (
        <>
            <BoardPostList mbti={mbti} posts={posts}/>
        </>
    )
}

export default BoardPostBox;