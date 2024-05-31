import React, {useContext, useEffect, useState} from 'react'
import style from './BoardDetail.module.css'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {getFontColor, getButtonColor, formatDate, isValidMbti} from '../../Utils/helpers'
import CommentBox from './Comment'
import BoardTop from '../BoardTop/BoardTop'
import like from '../../Assets/images/board/like.png'
import unlike from '../../Assets/images/board/unlike.png'
import apiClient from '../../services/apiClient'
import {UserContext} from '../../userContext'
import BoardCommentBadgeList from "./BoardCommentBadgeList";
import 'react-quill/dist/quill.snow.css'
import Dompurify from "dompurify"
import BoardPostBox from "../Board/BoardPostBox";
import useBoardAPI from "../../api/Hooks/useBoardAPI";
import Pagination from "../Pagenation/Pagination";
import useBoardDetailAPI from "../../api/Hooks/useBoardDetailAPI";
import useCommentAPI from "../../api/Hooks/useCommentAPI";
import comment from "./Comment";


const BoardTitle = ({mbti, post, commentCount}) => {
    useEffect(() => {
    }, [post, commentCount])

    return (
        <div className={style.board_title_container}>
            <div style={{color: getFontColor(mbti)}} className={style.board_title_category}>
                <p>{post.category}</p>
            </div>
            <div className={style.board_title}>
                <h2>{post.title}</h2>
            </div>
            <div className={style.board_title_bottom}>
                <div className={style.board_title_bottom_left}>
                    <p>
                        <Link to={`/profile/${post.author}/`}>{post.author}
                            <sup style={{backgroundColor: getButtonColor(mbti)}}>{mbti.toUpperCase()}</sup>
                        </Link>
                    </p>

                    <p>{formatDate(post.created_at)}</p>
                </div>
                <div className={style.board_title_bottom_right}>
                    <p>조회 {post.hits}</p>
                    <p>좋아요 {post.likes}</p>
                    <p>댓글 {commentCount}</p>
                </div>
            </div>
        </div>
    )
}

const BoardContent = ({post, username, onSetLike}) => {
    const [likeOn, setLikeOn] = useState(false)

    useEffect(() => {
        const likeOn = post.like_usernames.includes(username)
        setLikeOn(likeOn)
    }, [post, username])

    const handleLikeOn = () => {
        if(!likeOn) {
            onSetLike(true)
        }
    }

    return (
        <div className={style.board_content_container}>
            <div>
                <div className="view ql-editor" dangerouslySetInnerHTML={{__html: Dompurify.sanitize(post.content)}}/>
            </div>

            <div className={style.board_content_like_button}>
                <button onClick={handleLikeOn}>
                    {likeOn ? <img src={like} alt=""/> : <img src={unlike} alt=""/>}
                </button>
                <p>{post.likes}</p>
            </div>
        </div>
    )
}

const BoardDetail = () => {
    const currentUser = useContext(UserContext)
    const {detailId: postId} = useParams()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const mbti = params.get('mbti')
    const boardMbti = params.get('boardMbti')

    /* post->comment 의존성 처리를 위한 state*/
    const [commentPostId, setCommentPostId] = useState(null);

    const {
        isLoading: isBoardLoading,
        posts,
        totalPage,
        currentPage,
        handleGetPostListPage,
    } = useBoardAPI(boardMbti);

    const {
        isLoading: isBoardDetailLoading,
        post,
        handleSetLike,
    } = useBoardDetailAPI(postId)

    const {
        isLoading: isCommentLoading,
        comments,
        commentCount,
        handlePostComment,
        handlePutComment,
        handleDeleteComment,
        handleAddLikeComment
    } = useCommentAPI(commentPostId)

    useEffect(() => {
        if (!isBoardDetailLoading && post && post.id) {
            setCommentPostId(post.id);
        }
    }, [isBoardDetailLoading, post]);

    useEffect(() => {
        document.body.classList.add(style.customBodyStyle);

        return () => {
            document.body.classList.remove(style.customBodyStyle);
        };
    }, []);

    if (isBoardLoading) {
        return <div>Loading board...</div>
    }

    if (isBoardDetailLoading) {
        return <div>Loading...</div>
    }

    if (isCommentLoading) {
        return <div>Loading comment...</div>
    }

    return (
        <div>
            <div className={style.elevated_component}>
                <div className={style.board_top_container}>
                {boardMbti === 'hot' ? 
                    <div className={style.container_content_category}>
                            <h1 style={{fontSize:"35px", paddingBottom:"20px", paddingTop:"80px"}}>인기글</h1>
                            <h3 style={{fontSize:"18px", color:"#6B6B6B", fontWeight:"400", paddingBottom:"20px"}}>좋아요 10개 이상의 글을 모아볼 수 있습니다.</h3>
                            <hr className={style.thick_line}/>
                    </div>
                    : <BoardTop mbti={boardMbti}/>
                }
                    
                </div>
                <div className={style.board_detail_container}>
                    <BoardTitle mbti={mbti} post={post} commentCount={commentCount}/>
                    <BoardContent post={post} username={currentUser ? currentUser.username : ''}
                                onSetLike={handleSetLike}/>
                    {currentUser && post.author === currentUser.username ? (
                        <div className={style.buttonSection}>
                            <button
                                onClick={() => {
                                    navigate(`/update/${post.id}?mbti=${mbti}`)
                                }}
                            >
                                수정
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await apiClient.delete(`/api/posts/${post.id}/`)
                                        navigate(`/board/${mbti}`)
                                    } catch (error) {
                                        console.error('Error during delete post:', error)
                                    }
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    ) : null}
                    <BoardCommentBadgeList initializePost={post}/>
                    <CommentBox post={post} comments={comments} commentCount={commentCount}
                                onAddComment={handlePostComment}
                                onUpdateComment={handlePutComment}
                                onDeleteComment={handleDeleteComment}
                                onAddLikeComment={handleAddLikeComment}
                    />

                </div>
            </div>
            <div className={style.elevated_component}>
                <div className={style.board_list_container}>
                    <div className={style.board_list_bottom_container}>
                        <BoardPostBox boardMbti={boardMbti} posts={posts} currentPostId={postId}/>
                        <Pagination currentPage={currentPage} totalPages={totalPage}
                                    onPageChange={handleGetPostListPage}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoardDetail
