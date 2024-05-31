import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import style from "./Board.module.css";
import {formatDateDayBefore, getButtonColor, getFontColor} from "../../Utils/helpers";

const BoardPost = ({boardMbti, post, currentPostId = null}) => {
    const navigate = useNavigate()

    const handleMoveToPostMbti = (postMbti) => {
        navigate(`/board/${postMbti}/`)
    }

    const getPostBackgroundStyle = () => {
        if (currentPostId === null) {
            return {}
        }

        if (currentPostId === post.id.toString()) {
            return {
                backgroundColor: "#f1f1f1"
            }
        } else {
            return {}
        }
    }

    const getTitleTextStyle = () => {
        if (currentPostId === null) {
            return {}
        }

        if (currentPostId === post.id.toString()) {
            return {
                fontWeight: "bold"
            }
        } else {
            return {}
        }
    }

    console.log(post)
    return (
        <>
            <div className={style.board_post} style={getPostBackgroundStyle()}>
                <div className={style.board_post_left}>
                    <div className={style.board_post_category}>
                        <p style={{color: getFontColor(post.post_mbti)}}>{post.category}</p>
                    </div>
                    <div className={style.board_post_title}>
                        <Link
                            to={`/detail/${post.id}?mbti=${post.post_mbti}&boardMbti=${boardMbti}`} style={getTitleTextStyle()}>{post.title}</Link>
                        <p style={{color: getFontColor(post.post_mbti)}}>[{post.comments}]</p>
                    </div>
                    <div className={style.board_post_bottom}>
                        <div>
                            <p>{post.author}<sup style={{backgroundColor: getButtonColor(post.post_mbti)}}>{post.post_mbti.toUpperCase()}</sup></p>
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
                        {post.mbti.map((m, index) => (
                            <button key={index}
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

const BoardPostList = ({boardMbti, posts, currentPostId}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [posts])

    return (
        <div>
            {posts.map((post, index) => (
                <div key={index}>
                    <BoardPost currentPostId={currentPostId} post={post} boardMbti={boardMbti}/>
                </div>
            ))}
        </div>
    )
}

const BoardPostBox = ({boardMbti, posts, currentPostId}) => {
    return (
        <>
            <BoardPostList boardMbti={boardMbti} posts={posts} currentPostId={currentPostId}/>
        </>
    )
}

export default BoardPostBox;