import React, {useEffect, useState} from 'react';
import style from './BoardDetail.module.css'
import {useLocation, useParams} from "react-router-dom";
import {getUrl, getFontColor, getButtonColor} from "../../Utils/helpers";
import CommentBox from "../Comment/Comment";
import BoardTop from "../BoardTop/BoardTop"
import axios from "axios";
import like from "../../Assets/images/comment/like.png"
import {addLikeToPost, getPostById} from "../../api/services/CommentService";

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
                    <p>{post.created_at}</p>
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

const BoardContent = ({post, onAddLike}) => {
    useEffect(() => {
        console.log(`post = ${post.likes}`)
    }, [post]);

    return (
        <div className={style.board_content_container}>
            <div className={style.board_content_text}>
                <p>{post.content}</p>
            </div>

            <div className={style.board_content_like_button}>
                <button onClick={onAddLike}><img src={like} alt=""/></button>
                <p>{post.likes}</p>
            </div>
            <hr/>
        </div>
    )
}

const BoardDetail = () => {
    const {detailId} = useParams()
    const location = useLocation();
    const {mbti} = location.state || {};
    const [post, setPost] = useState({});

    useEffect(() => {
        handleGet()

        const accessToken = localStorage.getItem('accessToken')
        console.log('access token', accessToken)
    }, []);

    const handleGet = () => {
        getPostById(detailId)
            .then(response => {
                console.log('get post from server', response.data)
                setPost(response.data)
            })
            .catch(error => {
                console.error('Error during get post detail:', error)
            })
    }

    const handleAddLike = () => {
        addLikeToPost(detailId, 1)
            .then(response => {
                handleGet()
            })
            .catch(error => {
                console.error('Error during add like to post:', error)
            })
    }

    return (
        <>
            <div className={style.vertical}>
                <BoardTop mbti={mbti}/>

                <h3></h3>
                <BoardTitle mbti={mbti} post={post}/>

                <BoardContent post={post} onAddLike={handleAddLike}/>

                <CommentBox postId={post.id}/>

            </div>
        </>
    )
}
export default BoardDetail;
