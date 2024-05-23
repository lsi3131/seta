import React, {useContext, useEffect, useRef, useState} from 'react';
import style from './Comment.module.css'
import {getButtonColor, getUpdateTime} from "../../Utils/helpers";
import like from "../../Assets/images/comment/like.png"
import unlike from "../../Assets/images/comment/unlike.png"
import filterOn from "../../Assets/images/comment/filter_on.png"
import filterOff from "../../Assets/images/comment/filter_off.png"
import reply from "../../Assets/images/comment/reply.png"
import apiClient from "../../services/apiClient";
import {UserContext} from "../../userContext";
import {Link} from "react-router-dom";
import PopupFilter from "./PopupFilter";
import Report from '../Report/Report';

const CommentSubInput = ({
                             mode,
                             parentId,
                             commentId,
                             initialContent,
                             onAddComment,
                             onUpdateComment,
                         }) => {
    const [content, setContent] = useState(initialContent)

    useEffect(() => {
    }, []);

    const getModeText = () => {
        let text = '댓글 등록';
        if (mode === 'reply') {
            text = '댓글 등록';
        } else if (mode === 'update') {
            text = '댓글 수정';
        }
        return text;
    }

    const handleRegisterComment = () => {
        if (mode === 'reply') {
            onAddComment(content, parentId)
        } else if (mode === 'update') {
            onUpdateComment(commentId, content)
        }
    }

    return (
        <>
            <hr/>
            <div className={style.comment_sub_input}>
                <div className={style.comment_sub_input_1}>
                    <div className={style.comment_sub_input_1_1}>
                        <img src={reply} alt=""/>
                        <p>{getModeText()}</p>
                    </div>
                </div>
                <div className={style.comment_sub_input_2}>
                    <textarea
                        placeholder="댓글을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}/>
                    <button onClick={handleRegisterComment}>댓글 등록</button>
                </div>

            </div>
        </>
    )
}

const Comment = ({
                     comment,
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
    }, [comment]);

    const shouldLogin = () => {
        return currentUser === null
    }

    const canReply = () => {
        return currentUser && currentUser['mbti_type'] !== null;
    }

    const isSameUser = (comment) => {
        if (currentUser === null) {
            return;
        }

        return comment.author === currentUser['username'];
    }

    const isLikeOn = (comment) => {
        if (currentUser === null) {
            return false;
        }

        return comment.recommend.includes(currentUser['user_id'])
    }

    const handleSetLike = () => {
        onAddLikeComment(comment.id, !isLikeOn(comment))
    }

    const handleInputMode = (modeType) => {
        if (modeType !== inputModeType) {
            setInputModeType(modeType)
        } else {
            setInputModeType("")
        }
    }

    const handleDeleteComment = () => {
        const result = window.confirm("댓글을 삭제하시겠습니까?");
        if (result) {
            onDeleteComment(comment.id)
        }
    }

    return (
        <div>
            <div key={comment.id}>
                <div className={style.comment}>
                    <div className={style.comment_left_1}>
                        {isChild && <img src={reply} alt=""/>}

                        <div className={style.comment_left_1_1}>
                            <div className={style.comment_left_1_1_author}>
                                <p>
                                    <Link to={`/profile/${comment.author}/`}>{comment.author}
                                        <sup
                                            style={{backgroundColor: getButtonColor(comment.author_mbti)}}>{comment.author_mbti.toUpperCase()}</sup>
                                    </Link>
                                </p>
                                <p>{getUpdateTime(comment.created_at)}</p>
                            </div>
                            <pre>{comment.content}</pre>
                        </div>
                    </div>
                    <div className={style.comment_right}>
                        <div className={style.comment_right_button}>
                            <div className={style.comment_left_bottom_1_1_like}>
                                <button onClick={handleSetLike} disabled={shouldLogin()}>
                                    {isLikeOn(comment) ?
                                        <img src={like} alt=""/> :
                                        <img src={unlike} alt=""/>
                                    }
                                </button>
                                <p>{comment.recommend.length}</p>
                            </div>
                            {!isChild && canReply() &&
                                <button onClick={() => handleInputMode('reply')}>댓글</button>
                            }
                            {isSameUser(comment) &&
                                <>
                                    <button onClick={() => handleInputMode('update')}>수정</button>
                                    <button onClick={handleDeleteComment}>삭제</button>
                                </>
                            }
                            <Report author={comment.author} 
                            mbti={currentUser.mbti_type}/>
                        </div>
                    </div>
                </div>
                {inputModeType === 'reply' &&
                    <CommentSubInput mode={inputModeType} initialContent="" parentId={comment.id}
                                     onAddComment={onAddComment}/>
                }
                {inputModeType === 'update' &&
                    <CommentSubInput mode={inputModeType} initialContent={comment.content} commentId={comment.id}
                                     onUpdateComment={onUpdateComment}/>
                }

            </div>
            {comment.children && comment.children.map(child => (
                <>
                    <hr/>
                    <Comment
                        key={child.id}
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
    );
};


const CommentList = ({
                         comments,
                         commentCount,
                         onAddComment,
                         onUpdateComment,
                         onDeleteComment,
                         onAddLikeComment
                     }) => {

    const [filterMbtiList, setFilterMbtiList] = useState([])

    useEffect(() => {
    }, [comments, commentCount]);

    const [showPopup, setShowPopup] = useState(false);

    const handleShowFilter = () => {
        setShowPopup(true);
    }

    const handleCloseFilter = () => {
        setShowPopup(false);
    }

    const handleApplyFilter = (mbtiList) => {
        setFilterMbtiList(mbtiList)
        setShowPopup(false);
    }

    const isMbtiInFilter = (comment) => {
        return filterMbtiList.length === 0 || filterMbtiList.some(e => e.toLowerCase() === comment.author_mbti.toLowerCase());
    }

    const isFilterOn = () => {
        return filterMbtiList.length > 0;
    }

    return (
        <div className={style.comment_list}>
            {showPopup && <PopupFilter initialMbtiList={filterMbtiList} onApplyPopup={handleApplyFilter}
                                       onClosePopup={handleCloseFilter}/>}
            <div className={style.comment_list_info}>
                <div className={style.comment_list_info_left}>
                    <p>댓글</p>
                    <h3>{commentCount}</h3>
                </div>
                <div className={style.comment_list_info_right}>
                    <button onClick={handleShowFilter}><img src={isFilterOn() ? filterOn : filterOff} alt=""/></button>
                </div>
            </div>
            {comments.map((comment, index) => (
                <div>
                    {isMbtiInFilter(comment) && (
                        <>
                            <hr/>
                            <Comment key={index} comment={comment}
                                     onAddComment={onAddComment}
                                     onUpdateComment={onUpdateComment}
                                     onDeleteComment={onDeleteComment}
                                     onAddLikeComment={onAddLikeComment}/>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

const CommentInput = ({post, onAddComment, parentCommentId}) => {
    const currentUser = useContext(UserContext)
    const [content, setContent] = useState('');

    useEffect(() => {
    }, []);

    const handleAddComment = async (e) => {
        e.preventDefault();
        onAddComment(content, parentCommentId)
        setContent('');
    };

    const navigateToLogin = () => {
        window.location.href = '/login/'
    }

    const navigateToProfile = () => {
        window.location.href = `/profile/${currentUser.username}/`
    }

    const shouldLogin = () => {
        return currentUser === null;
    }

    const shouldRegisterMbti = () => {
        return currentUser && currentUser['mbti_type'] === null
    }

    const notIncludedInMbtiList = () => {
        const include = post.mbti.some(e => e.toLowerCase() === currentUser['mbti_type'].toLowerCase())
        return currentUser && currentUser['mbti_type'] !== null && !include
    }

    const canRegisterComment = () => {
        return !notIncludedInMbtiList()
    }

    const isDisabled = () => {
        return !canRegisterComment();
    }

    return (
        <div className={style.comment_input_container}>
            <div className={style.comment_input_user}>
                {canRegisterComment() && (
                    <p>{currentUser.username}
                        <sup
                            style={{backgroundColor: getButtonColor(currentUser['mbti_type'])}}>{currentUser['mbti_type'].toUpperCase()}</sup>
                    </p>
                )}
            </div>
            {shouldLogin() && (
                <textarea
                    style={{backgroundColor: "#e0e0e0", cursor: "pointer"}}
                    placeholder={"댓글을 등록하시려면 로그인 해주세요. 로그인 하시겠습니까?"}
                    onClick={navigateToLogin}
                    rows={4}
                    disabled={false}
                ></textarea>
            )}
            {shouldRegisterMbti() && (
                <textarea
                    style={{backgroundColor: "#e0e0e0", cursor: "pointer"}}
                    placeholder={"댓글을 등록하시려면 MBTI를 등록해주세요. MBTI를 등록 하시겠습니까?"}
                    onClick={navigateToProfile}
                    rows={4}
                    disabled={false}
                ></textarea>
            )}
            {canRegisterComment() && (
                <textarea
                    placeholder={"댓글을 입력하세요"}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                ></textarea>
            )}
            {notIncludedInMbtiList() && (
                <textarea
                    style={{backgroundColor: "#e0e0e0", cursor: "pointer"}}
                    placeholder={"댓글을 쓸 수 없는 타입입니다"}
                    rows={4}
                    disabled={false}
                ></textarea>
            )}

            <div className={style.comment_input_buttons_container}>
                <button onClick={handleAddComment} style={{width: '100px'}} disabled={isDisabled()}>댓글 등록</button>
            </div>
        </div>
    );
};

const CommentBox = ({
                        post, comments, commentCount,
                        onAddComment,
                        onUpdateComment,
                        onDeleteComment,
                        onAddLikeComment,
                    }) => {
    useEffect(() => {
    }, [post, commentCount, comments]);


    return (
        <div className={style.comment_box}>
            <CommentList comments={comments}
                         commentCount={commentCount}
                         onAddComment={onAddComment}
                         onUpdateComment={onUpdateComment}
                         onDeleteComment={onDeleteComment}
                         onAddLikeComment={onAddLikeComment}/>
            <hr/>
            <CommentInput post={post} onAddComment={onAddComment}/>
        </div>
    );
}

export default CommentBox;

