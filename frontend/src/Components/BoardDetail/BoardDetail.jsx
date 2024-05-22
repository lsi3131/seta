import React, { useContext, useEffect, useState } from 'react'
import style from './BoardDetail.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getFontColor, getButtonColor, formatDate, isValidMbti } from '../../Utils/helpers'
import CommentBox from '../Comment/Comment'
import BoardTop from '../BoardTop/BoardTop'
import like from '../../Assets/images/board/like.png'
import unlike from '../../Assets/images/board/unlike.png'
import apiClient from '../../services/apiClient'
import { UserContext } from '../../userContext'

const BoardTitle = ({ mbti, post }) => {
    useEffect(() => {}, [post])

    return (
        <div className={style.board_title_container}>
            <div style={{ color: getFontColor(mbti) }} className={style.board_title_category}>
                <p>{post.category}</p>
            </div>
            <div className={style.board_title}>
                <h2>{post.title}</h2>
                <p style={{ backgroundColor: getButtonColor(mbti) }}>{mbti}</p>
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
        </div>
    )
}

const BoardContent = ({ post, username, onSetLike }) => {
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
            <div className={style.board_content_text}>
                <p>{post.content}</p>
            </div>

            <div className={style.board_content_like_button}>
                <button onClick={handleLikeOn}>
                    {likeOn ? <img src={like} alt="" /> : <img src={unlike} alt="" />}
                </button>
                <p>{post.likes}</p>
            </div>
        </div>
    )
}

const BoardDetail = () => {
    const currentUser = useContext(UserContext)
    const { detailId } = useParams()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const mbti = params.get('mbti')

    const [post, setPost] = useState(null)
    const [isValid, setIsValid] = useState(true)
    const [isLoading, setIsLoading] = useState(true) // 로딩 상태 추가

    useEffect(() => {
        handleGet()
    }, [detailId, mbti, navigate])

    useEffect(() => {
        if (post && post.mbti) {
            const include = post.mbti.some((e) => e.toLowerCase() === mbti.toLowerCase())
            if (!include) {
                setIsValid(false)
                navigate('/')
            } else {
                setIsLoading(false) // 유효성 검사 후 로딩 상태 해제
            }
        }
    }, [post, mbti, navigate])

    const handleGet = async () => {
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
            handleGet()
        } catch (error) {
            console.error('Error during add like to post:', error)
        }
    }

    if (isLoading) {
        return <div>Loading...</div> // 데이터를 불러오는 동안 로딩 메시지 표시
    }

    if (!isValid) {
        return null // 유효하지 않은 경우 아무것도 렌더링하지 않음
    }

    return (
        <div className={style.vertical}>
            <BoardTop mbti={mbti} />
            <BoardTitle mbti={mbti} post={post} />

            <BoardContent post={post} username={currentUser ? currentUser.username : ''} onSetLike={handleSetLike} />
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
            <CommentBox postId={post.id} />
        </div>
    )
}

export default BoardDetail
