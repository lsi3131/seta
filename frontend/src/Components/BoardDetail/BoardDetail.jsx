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
                            <sup style={{backgroundColor: getButtonColor(mbti)}}>{mbti}</sup>
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
        onSetLike(!likeOn)
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
    const {detailId} = useParams()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const mbti = params.get('mbti')
    const boardMbti = params.get('boardMbti')
    const postId = params.get('postId')

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState(null);
    const [commentCount, setCommentCount] = useState(0);
    const [isValid, setIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    const {
        isLoading: isBoardLoading,
        error,
        posts,
        totalPage,
        currentPage,
        handleGetPostListPage,
    } = useBoardAPI(boardMbti);

    useEffect(() => {
        /* 게시판 정보와 조회수를 업데이트*/
        handleGetPost()
        handlePutHits()
    }, [detailId, mbti, navigate])

    useEffect(() => {
        if (post) {
            /* 게시판 정보를 전부 읽어온 후 댓글 리스트를 읽어온다. */
            handleGetCommentList()
        }
    }, [post, mbti, navigate])

    /* Comment를 전부 읽어오면 로딩이 완료된다.*/
    useEffect(() => {
        if (comments) {
            setIsLoading(false) // 유효성 검사 후 로딩 상태 해제
        }
    }, [comments])


    useEffect(() => {
        document.body.classList.add(style.customBodyStyle);

        return () => {
            document.body.classList.remove(style.customBodyStyle);
        };
    }, []);

    const handlePutHits = async () => {
        try {
            await apiClient.put(`/api/posts/${detailId}/hits/`)
        } catch (error) {
            console.error('Error during put hits:', error)
        }
    }

    const handleGetPost = async () => {
        try {
            const response = await apiClient.get(`/api/posts/${detailId}/`)
            setPost(response.data)
        } catch (error) {
            console.error('Error during get post detail:', error)
            setIsValid(false)
            navigate('/')
        }
    }

    const handleSetLike = async (like_on) => {
        if (!currentUser) {
            return
        }

        const data = {
            like: like_on ? 1 : 0,
        }

        try {
            await apiClient.post(`/api/posts/${post.id}/likey/`, data)
            await handleGetPost()
        } catch (error) {
            console.error('Error during add like to post:', error)
        }
    }

    const handleGetCommentList = () => {
        apiClient.get(`/api/posts/${post.id}/comments/`)
            .then(response => {
                console.log('get comments successful:', response.data);
                setComments(response.data['results']);
                setCommentCount(response.data['count']);
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    };

    const handlePostComment = (content, parentId = null) => {
        let data = {
            content: content
        };
        if (parentId) {
            data.parent_comment_id = parentId;
        }
        apiClient.post(`/api/posts/${post.id}/comments/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handlePutComment = (commentId, content) => {
        const data = {
            content: content
        };
        apiClient.put(`/api/posts/${post.id}/comments/${commentId}/`, data)
            .then(response => {
                console.log('put comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during put comments:', error.response.data.error);
            })
    }

    const handleDeleteComment = (commentId) => {
        apiClient.delete(`/api/posts/${post.id}/comments/${commentId}/`)
            .then(response => {
                console.log('delete comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handleAddLikeComment = (commentId, isLikeOn) => {
        const data = {
            recommend: isLikeOn ? 1 : 0
        };

        apiClient.post(`/api/posts/${post.id}/comments/${commentId}/recommend/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    if (isLoading) {
        return <div>Loading...</div> // 데이터를 불러오는 동안 로딩 메시지 표시
    }

    if (!isValid) {
        return null // 유효하지 않은 경우 아무것도 렌더링하지 않음
    }

    if (isBoardLoading) {
        return <div>Loading board...</div>
    }

    return (
        <div>
            <div className={style.elevated_component}>
                <div className={style.board_top_container}>
                    <BoardTop mbti={mbti}/>
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
                                onAddLikeComment={handleAddLikeComment}/>

                </div>
            </div>
            <div className={style.elevated_component}>
                <div className={style.board_list_container}>
                    <div className={style.board_list_top_container}>
                        <BoardTop mbti={boardMbti}/>
                    </div>
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
