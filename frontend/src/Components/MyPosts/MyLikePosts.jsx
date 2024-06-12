import React, { useEffect, useState, useContext } from "react";
import style from "./MyPosts.module.css"
import apiClient from "services/apiClient";
import { Link } from "react-router-dom";
import { formatDateDayBefore, getFontColor, getButtonColor } from "../../Utils/helpers"
import Pagination from '../Pagenation/Pagination'



const MyLikePosts = (e) => {
    const posts = e.posts.results
    const user = e.user
    const selectedPosts = e.selectedPosts
    const onPostSelect = e.onPostSelect
    const allSelect = e.allSelect

    return (
        <div key={posts.id} className={style.board_posts}>
            {posts.map((post) => (
                <>
                    <div key={post.id} className={style.board_post}>
                        <div className={style.board_post_left}>
                            <input className={style.board_post_left_checkbox} type="checkbox"
                                checked={allSelect || selectedPosts.includes(post.id)}
                                onChange={() => { onPostSelect(post.id) }} />
                            <div className={style.board_post_left_content}>
                                <div className={style.board_post_category}>
                                    <p style={{ color: getFontColor(post.post_mbti) }}>{post.category}</p>
                                </div>
                            
                            <div key={post.id} className={style.board_post_title}>
                                <Link to={`/detail/${post.id}?mbti=${post.post_mbti}&boardMbti=${post.post_mbti}`}>{post.title}</Link>
                                <p style={{ color: getFontColor(post.post_mbti) }}>[{post.comments}]</p>
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

export default MyLikePosts