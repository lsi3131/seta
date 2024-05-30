import {Link, useNavigate} from "react-router-dom";
import style from "./SearchPost.module.css";
import {formatDateDayBefore, getButtonColor, getFontColor} from "../../Utils/helpers";
import React from "react";

const SearchPost = ({post}) => {
    return (
        <>
            <div className={style.post}>
                <div className={style.left}>
                    <div className={style.category}>
                        <p style={{color: getFontColor(post.post_mbti)}}>{post.post_mbti.toUpperCase()}</p>
                    </div>
                    <div className={style.title}>
                        <Link to={`/detail/${post.id}?mbti=${post.post_mbti}&boardMbti=${post.post_mbti}`}>{post.title}</Link>
                        <p style={{color: getFontColor(post.post_mbti)}}>[{post.comments}]</p>
                    </div>
                    <div className={style.left_bottom}>
                        <div>
                            <p>{post.category}</p>
                        </div>
                        <div>
                            <p>{post.author}</p>
                        </div>
                        <div>
                            <p>{formatDateDayBefore(post.created_at)}</p>
                        </div>
                        <div className={style.like}>
                            <p>좋아요</p>
                            <p>{post.likes}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.right}>
                        {post.mbti.map((m) => (
                            <button
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

export default SearchPost;