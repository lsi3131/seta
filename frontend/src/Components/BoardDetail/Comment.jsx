import React, { useContext, useEffect, useRef, useState } from 'react'
import style from './Comment.module.css'
import { getButtonColor, getUpdateTime } from '../../Utils/helpers'
import like from '../../Assets/images/comment/like.png'
import unlike from '../../Assets/images/comment/unlike.png'
import filterOn from '../../Assets/images/comment/filter_on.png'
import filterOff from '../../Assets/images/comment/filter_off.png'
import reply from '../../Assets/images/comment/reply.png'
import { UserContext } from '../../userContext'
import { Link } from 'react-router-dom'
import PopupFilter from './PopupFilter'
import Report from '../Report/Report'
import Pagination from '../Pagenation/Pagination'

const CommentSubInput = ({ mode, parentId, commentId, initialContent, onAddComment, onUpdateComment }) => {
    const [content, setContent] = useState(initialContent)
    const [isComposing, setIsComposing] = useState(false)
    const [rows, setRows] = useState(1)

    useEffect(() => {}, [])

    useEffect(() => {
        const lineCount = content.split('\n').length
        setRows(lineCount)
    }, [content])

    const handleCompositionStart = () => {
        setIsComposing(true)
    }

    const handleCompositionEnd = () => {
        setIsComposing(false)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !isComposing) {
            if (event.shiftKey) {
                // Shift + Enter: 줄 바꿈
            } else {
                // Enter : 제출
                event.preventDefault()
                handleRegisterComment()
            }
        }
    }

    const getModeText = () => {
        let text = '댓글 등록'
        if (mode === 'reply') {
            text = '댓글 등록'
        } else if (mode === 'update') {
            text = '댓글 수정'
        }
        return text
    }

    const handleRegisterComment = () => {
        console.log(content)
        if (mode === 'reply') {
            onAddComment(content, parentId)
        } else if (mode === 'update') {
            onUpdateComment(commentId, content)
        }
    }

    return (
        <>
            <hr />
            <div className={style.comment_sub_input}>
                <div className={style.comment_sub_input_1}>
                    <div className={style.comment_sub_input_1_1}>
                        <img src={reply} alt="" />
                        <p>{getModeText()}</p>
                    </div>
                </div>
                <div className={style.comment_sub_input_2}>
                    <textarea
                        style={{ whiteSpace: 'pre-wrap' }}
                        placeholder="댓글을 입력하세요"
                        value={content}
                        onChange={(e) => {
                            if (e.target.value.length <= 400) {
                                if (e.target.scrollHeight > 8 * 20) {
                                    e.target.style.height = '160px'
                                    alert('댓글은 8줄 이내로 작성해주세요.')
                                } else {
                                    e.target.style.height = 'auto'
                                    e.target.style.height = e.target.scrollHeight + 'px'
                                    setContent(e.target.value)
                                }
                            } else {
                                alert('댓글은 400자 이내로 작성해주세요.')
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        rows={rows}
                    />
                    <button onClick={handleRegisterComment}>댓글 등록</button>
                </div>
            </div>
        </>
    )
}

const Comment = ({
    comment,
    post,
    postMbtiList,
    onAddComment,
    onUpdateComment,
    onDeleteComment,
    onAddLikeComment,
    isChild,
}) => {
    const currentUser = useContext(UserContext)
    const [inputModeType, setInputModeType] = useState('')

    useEffect(() => {
        setInputModeType('')
    }, [comment])

    const shouldLogin = () => {
        return currentUser === null
    }

    const canReply = () => {
        return currentUser && currentUser['mbti_type'] !== null
    }

    const isSameUser = (comment) => {
        if (currentUser === null) {
            return
        }

        return comment.author === currentUser['username']
    }

    const isLikeOn = (comment) => {
        if (currentUser === null) {
            return false
        }

        return comment.recommend.includes(currentUser['user_id'])
    }

    const isMbtiInPostMbtiList = (comment) => {
        return (
            postMbtiList.length > 0 && postMbtiList.some((e) => e.toLowerCase() === comment.comment_mbti.toLowerCase())
        )
    }

    const handleSetLike = () => {
        if (!isLikeOn(comment)) {
            onAddLikeComment(comment.id, true)
        }
    }

    const handleInputMode = (modeType) => {
        if (modeType !== inputModeType) {
            setInputModeType(modeType)
        } else {
            setInputModeType('')
        }
    }

    const handleDeleteComment = () => {
        const result = window.confirm('댓글을 삭제하시겠습니까?')
        if (result) {
            onDeleteComment(comment.id)
        }
    }

    return (
        <div>
            <div key={comment.id}>
                {isMbtiInPostMbtiList(comment) || comment.author === post.author ? (
                    <div className={style.comment}>
                        <div className={style.comment_left_1}>
                            {isChild && <img src={reply} alt="" />}

                            <div className={style.comment_left_1_1}>
                                <div className={style.comment_left_1_1_author}>
                                    <p>
                                        <Link to={`/profile/${comment.author}/`}>
                                            {comment.author}
                                            <sup style={{ backgroundColor: getButtonColor(comment.comment_mbti) }}>
                                                {comment.comment_mbti.toUpperCase()}
                                            </sup>
                                        </Link>
                                    </p>
                                    <p>{getUpdateTime(comment.created_at)}</p>
                                </div>

                                <div className={style.comment_ment}>
                                    {comment.content.split('\n').map((line, index) => (
                                        <span key={index}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={style.comment_right}>
                            <div className={style.comment_right_button}>
                                <div className={style.comment_left_bottom_1_1_like}>
                                    <button onClick={handleSetLike} disabled={shouldLogin()}>
                                        {isLikeOn(comment) ? <img src={like} alt="" /> : <img src={unlike} alt="" />}
                                    </button>
                                    <p>{comment.recommend.length}</p>
                                </div>
                                {!isChild && canReply() && (
                                    <button onClick={() => handleInputMode('reply')}>댓글</button>
                                )}
                                {isSameUser(comment) && (
                                    <>
                                        <button onClick={() => handleInputMode('update')}>수정</button>
                                        <button onClick={handleDeleteComment}>삭제</button>
                                    </>
                                )}
                                <Report author={comment.author} mbti={currentUser.mbti_type} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={style.not_included_comment_mbti_container}>
                        <p>[더 이상 허용되지 않은 MBTI 타입의 댓글입니다.]</p>
                    </div>
                )}
                {inputModeType === 'reply' && (
                    <CommentSubInput
                        mode={inputModeType}
                        initialContent=""
                        parentId={comment.id}
                        onAddComment={onAddComment}
                    />
                )}
                {inputModeType === 'update' && (
                    <CommentSubInput
                        mode={inputModeType}
                        initialContent={comment.content}
                        commentId={comment.id}
                        onUpdateComment={onUpdateComment}
                    />
                )}
            </div>
            {comment.children &&
                comment.children.map((child) => (
                    <>
                        <hr />
                        <Comment
                            key={child.id}
                            post={post}
                            postMbtiList={postMbtiList}
                            onAddComment={onAddComment}
                            onDeleteComment={onDeleteComment}
                            onAddLikeComment={onAddLikeComment}
                            onUpdateComment={onUpdateComment}
                            comment={child}
                            isChild={true}
                        />
                    </>
                ))}
        </div>
    )
}

const CommentList = ({
    comments,
    post,
    postMbtiList,
    commentCount,
    onAddComment,
    onUpdateComment,
    onDeleteComment,
    onAddLikeComment,
}) => {
    const [filterMbtiList, setFilterMbtiList] = useState([])

    useEffect(() => {}, [comments, commentCount])

    const [showPopup, setShowPopup] = useState(false)

    const handleShowFilter = () => {
        setShowPopup(true)
    }

    const handleCloseFilter = () => {
        setShowPopup(false)
    }

    const handleApplyFilter = (mbtiList) => {
        setFilterMbtiList(mbtiList)
        setShowPopup(false)
    }

    const isMbtiInFilter = (comment) => {
        return (
            filterMbtiList.length === 0 ||
            filterMbtiList.some((e) => e.toLowerCase() === comment.comment_mbti.toLowerCase())
        )
    }

    const isFilterOn = () => {
        return filterMbtiList.length > 0
    }

    return (
        <div className={style.comment_list}>
            {showPopup && (
                <PopupFilter
                    initialMbtiList={filterMbtiList}
                    onApplyPopup={handleApplyFilter}
                    onClosePopup={handleCloseFilter}
                />
            )}
            <div className={style.comment_list_info}>
                <div className={style.comment_list_info_left}>
                    <p>댓글</p>
                    <h3>{commentCount}</h3>
                </div>
                <div className={style.comment_list_info_right}>
                    <button onClick={handleShowFilter}>
                        <img src={isFilterOn() ? filterOn : filterOff} alt="" />
                    </button>
                </div>
            </div>
            {comments.map((comment, index) => (
                <div>
                    {isMbtiInFilter(comment) && (
                        <>
                            <hr />
                            <Comment
                                key={index}
                                comment={comment}
                                post={post}
                                postMbtiList={postMbtiList}
                                onAddComment={onAddComment}
                                onUpdateComment={onUpdateComment}
                                onDeleteComment={onDeleteComment}
                                onAddLikeComment={onAddLikeComment}
                            />
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}

const CommentInput = ({ post, onAddComment, parentCommentId }) => {
    const currentUser = useContext(UserContext)
    const [content, setContent] = useState('')
    const [isComposing, setIsComposing] = useState(false)
    const [rows, setRows] = useState(1)

    useEffect(() => {}, [])

    useEffect(() => {
        const lineCount = content.split('\n').length
        setRows(lineCount)
    }, [content])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isComposing) {
            if (e.shiftKey) {
                // Shift + Enter: 줄 바꿈
                // setContent(content + '\n');
            } else {
                // Enter : 제출
                e.preventDefault()
                handleAddComment(e)
            }
        }
    }

    const handleCompositionStart = () => {
        setIsComposing(true)
    }

    const handleCompositionEnd = () => {
        setIsComposing(false)
    }

    const handleAddComment = () => {
        // e.preventDefault();
        onAddComment(content, parentCommentId)
        setContent('')
    }

    const navigateToLogin = () => {
        window.location.href = '/login/'
    }

    const navigateToProfile = () => {
        window.location.href = `/profile/${currentUser.username}/`
    }

    const shouldLogin = () => {
        return currentUser === null
    }

    const shouldRegisterMbti = () => {
        return currentUser && currentUser['mbti_type'] === null
    }

    const notIncludedInMbtiList = () => {
        if (currentUser === null) {
            return false
        }
        if (currentUser['mbti_type'] === null) {
            return false
        }

        return !post.mbti.some((e) => e.toLowerCase() === currentUser['mbti_type'].toLowerCase())
    }

    const canRegisterComment = () => {
        if (currentUser === null) {
            return false
        }
        if (currentUser['mbti_type'] === null) {
            return false
        }

        return post.mbti.some((e) => e.toLowerCase() === currentUser['mbti_type'].toLowerCase())
    }

    const isDisabled = () => {
        return !canRegisterComment()
    }

    return (
        <div className={style.comment_input_container}>
            <div className={style.comment_input_user}>
                {(canRegisterComment() || currentUser['username'] === post.author) && (
                    <p>
                        {currentUser.username}
                        <sup style={{ backgroundColor: getButtonColor(currentUser['mbti_type']) }}>
                            {currentUser['mbti_type'].toUpperCase()}
                        </sup>
                    </p>
                )}
            </div>
            {currentUser['username'] !== post.author ? (
                <>
                    {shouldLogin() && (
                        <textarea
                            style={{ backgroundColor: '#e0e0e0', cursor: 'pointer', whiteSpace: 'pre-wrap' }}
                            placeholder={'댓글을 등록하시려면 로그인 해주세요. 로그인 하시겠습니까?'}
                            onClick={navigateToLogin}
                            rows={rows}
                            disabled={true}
                        ></textarea>
                    )}
                    {shouldRegisterMbti() && (
                        <textarea
                            style={{ backgroundColor: '#e0e0e0', cursor: 'pointer' }}
                            placeholder={'댓글을 등록하시려면 MBTI를 등록해주세요. MBTI를 등록 하시겠습니까?'}
                            onClick={navigateToProfile}
                            rows={rows}
                            disabled={true}
                        ></textarea>
                    )}
                    {canRegisterComment() && (
                        <textarea
                            placeholder={'댓글을 입력하세요'}
                            value={content}
                            onChange={(e) => {
                                if (e.target.value.length <= 400) {
                                    if (e.target.scrollHeight > 8 * 20) {
                                        e.target.style.height = '160px'
                                        alert('댓글은 8줄 이내로 작성해주세요.')
                                    } else {
                                        e.target.style.height = 'auto'
                                        e.target.style.height = e.target.scrollHeight + 'px'
                                        setContent(e.target.value)
                                        console.log('content', content, e.target.value)
                                    }
                                } else {
                                    alert('댓글은 400자 이내로 작성해주세요.')
                                }
                            }}
                            rows={rows}
                            onKeyDown={handleKeyDown}
                            onCompositionStart={handleCompositionStart}
                            onCompositionEnd={handleCompositionEnd}
                        ></textarea>
                    )}
                    {notIncludedInMbtiList() && (
                        <textarea
                            style={{ backgroundColor: '#e0e0e0', cursor: 'pointer' }}
                            placeholder={'댓글을 쓸 수 없는 타입입니다'}
                            rows={rows}
                            disabled={true}
                        ></textarea>
                    )}
                </>
            ) : (
                <textarea
                    placeholder={'댓글을 입력하세요'}
                    value={content}
                    onChange={(e) => {
                        if (e.target.value.length <= 400) {
                            if (e.target.scrollHeight > 8 * 20) {
                                e.target.style.height = '160px'
                                alert('댓글은 8줄 이내로 작성해주세요.')
                            } else {
                                e.target.style.height = 'auto'
                                e.target.style.height = e.target.scrollHeight + 'px'
                                setContent(e.target.value)
                            }
                        } else {
                            alert('댓글은 400자 이내로 작성해주세요.')
                        }
                    }}
                    rows={rows}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                ></textarea>
            )}

            <div className={style.comment_input_buttons_container}>
                <button
                    onClick={handleAddComment}
                    style={{ width: '100px' }}
                    disabled={isDisabled() && currentUser['username'] !== post.author}
                >
                    댓글 등록
                </button>
            </div>
        </div>
    )
}

const CommentBox = ({
    post,
    comments,
    commentCount,
    currentPage,
    totalPage,
    onAddComment,
    onUpdateComment,
    onDeleteComment,
    onAddLikeComment,
    onPageChange,
}) => {
    useEffect(() => {}, [post])

    useEffect(() => {}, [currentPage, totalPage])

    return (
        <div className={style.comment_box}>
            <CommentList
                comments={comments}
                post={post}
                postMbtiList={post.mbti}
                commentCount={commentCount}
                onAddComment={onAddComment}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
                onAddLikeComment={onAddLikeComment}
            />

            <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={onPageChange} />
            <div style={{ height: '30px' }}></div>
            <hr />
            <div style={{ height: '20px' }}></div>
            <CommentInput post={post} onAddComment={onAddComment} />
            <div style={{ height: '20px' }}></div>
        </div>
    )
}

export default CommentBox
