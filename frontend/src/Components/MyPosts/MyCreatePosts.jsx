import React, { useEffect, useState, useContext } from "react";
import style from "./MyPosts.module.css"
import { Link } from "react-router-dom";
import { formatDateDayBefore, getFontColor, getButtonColor } from "../../Utils/helpers"



const MyCreatePosts = (e) => {
    const posts = e.posts.results
    const user = e.user

    return (
        <div key={posts.id} className={style.board_posts}>
            {posts && posts.map((post) => (
                <>
                    <div key={post.id} className={style.board_post}>
                        <div className={style.board_post_left}>
                            <div className={style.board_post_category}>
                                <p style={{ color: getFontColor(user.mbti_type) }}>{post.category}</p>
                            </div>
                            <div key={post.id} className={style.board_post_title}>
                                <Link to={`/detail/${post.id}?mbti=${post.mbti[0]}`}>{post.title}</Link>
                                <p style={{ color: getFontColor(user.mbti_type) }}>[{post.comments}]</p>
                            </div>
                            <div className={style.board_post_bottom}>
                                <div>
                                    <p>{post.author}</p>
                                </div>
                                <div>
                                    <p>{formatDateDayBefore(post.created_at)}</p>
                                </div>
                                <div className={style.board_like}>
                                    <p>좋아요 {post.likes}</p>
                                </div>
                            </div>
                        </div>
                        <div key={post.mbti.id}>
                            <div className={style.board_post_right}>
                                {post.mbti.map(m => (
                                    <button style={{ backgroundColor: getButtonColor(m) }}>{m}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <hr />
                </>
            ))}
        </div>
    )
}

export default MyCreatePosts