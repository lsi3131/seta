import React, {useContext, useEffect, useState} from 'react';
import style from './BoardDetail.module.css'
import {useLocation, useParams} from "react-router-dom";
import {getFontColor, getButtonColor, formatDate} from "../../Utils/helpers";
import CommentBox from "../Comment/Comment";
import BoardTop from "../BoardTop/BoardTop"
import axios from "axios";
import like from "../../Assets/images/board/like.png"
import unlike from "../../Assets/images/board/unlike.png"
import {addLikeToPost, getPostById} from "../../api/services/CommentService";
import apiClient from "../../services/apiClient";
import {UserContext} from "../../userContext";

const BoardTitle = ({mbti, post}) => {
    useEffect(() => {
    }, [post]);


    return (
        <div className={style.board_title_container}>
            <div style={{color: getFontColor(mbti)}} className={style.board_title_category}>
                <p>{post.category}</p>
            </div>
            <div className={style.board_title}>
                <h2>{post.title}</h2>
                <p style={{backgroundColor: getButtonColor(mbti)}}>{mbti}</p>
            </div>
            <div className={style.board_title_bottom}>
                <div className={style.board_title_bottom_left}>
                    <p>{post.author}</p>
                    <p>{formatDate(post.created_at)}</p>
                </div>
                <div className={style.board_title_bottom_right}>
                    <p>조회 {post.hits}</p>
                    <p>좋아요 {post.likes}</p>
                    <p>댓글 {post.comments}</p>
                </div>
            </div>
            <hr/>
        </div>
    )
}

const BoardContent = ({post, username, onSetLike}) => {
    const [likeOn, setLikeOn] = useState(false)

    useEffect(() => {
        const likeOn = post.like_usernames.includes(username)
        setLikeOn(likeOn)
    }, [post]);

    const handleLikeOn = () => {
        onSetLike(!likeOn)
    }

    return (
        <div className={style.board_content_container}>
            <div className={style.board_content_text}>
                <p>{post.content}</p>
            </div>

            <div className={style.board_content_like_button}>
                <button onClick={handleLikeOn}>
                    {likeOn ?
                        <img src={like} alt=""/> :
                        <img src={unlike} alt=""/>
                    }
                </button>
                <p>{post.likes}</p>
            </div>
        </div>
    )
}

const BoardDetail = () => {
    const currentUser = useContext(UserContext);
    const location = useLocation();
    const {detailId} = useParams()
    const {mbti} = location.state || {};
    const [post, setPost] = useState({
        "id": 1997,
        "author": "",
        "category": "",
        "title": "",
        "hits": 0,
        "likes": 0,
        "like_usernames": [],
        "comments": 0,
        "mbti": [],
        "created_at": "",
        "updated_at": "",
        "content": ""
    });

    useEffect(() => {
        handleGet()
    }, []);

    const handleGet = () => {
        apiClient.get(`/api/posts/${detailId}/`)
            .then(response => {
                console.log('get post from server', response.data)
                setPost(response.data)
            })
            .catch(error => {
                console.error('Error during get post detail:', error)
            })
    }

    const handleSetLike = (like_on) => {
        if (currentUser === null) {
            return
        }

        const data = {
            like: like_on ? 1 : 0
        }
        console.log('like data', data)
        apiClient.post(`/api/posts/${post.id}/likey/`, data)
            .then(response => {
                handleGet()
            })
            .catch(error => {
                console.error('Error during add like to post:', error)
            });
    }

    return (
        <>
            <div className={style.vertical}>
                <BoardTop mbti={mbti}/>

                <BoardTitle mbti={mbti} post={post}/>

                <BoardContent post={post} username={currentUser ? currentUser['username'] : ""}
                              onSetLike={handleSetLike}/>

                <CommentBox postId={post.id}/>
            </div>
        </>
    )
}
export default BoardDetail;
