import React, {useContext, useEffect, useRef, useState} from 'react';
import style from './Comment.module.css'
import {getButtonColor, getUpdateTime} from "../../Utils/helpers";
import like from "../../Assets/images/comment/like.png"
import unlike from "../../Assets/images/comment/unlike.png"
import reply from "../../Assets/images/comment/reply.png"
import apiClient from "../../services/apiClient";
import {UserContext} from "../../userContext";
import {Counter} from "./ReducerTest";

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
                                <p>{comment.author}</p>
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
                            <button>신고</button>
                        </div>
                        <p style={{backgroundColor: getButtonColor(comment.author_mbti)}}>{comment.author_mbti.toUpperCase()}</p>
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
                         onAddComment,
                         onUpdateComment,
                         onDeleteComment,
                         onAddLikeComment
                     }) => {
    return (
        <div className={style.comment_list}>
            {comments.map((comment, index) => (
                <div>
                    <hr/>
                    <Comment key={index} comment={comment}
                             onAddComment={onAddComment}
                             onUpdateComment={onUpdateComment}
                             onDeleteComment={onDeleteComment}
                             onAddLikeComment={onAddLikeComment}/>
                </div>
            ))}
        </div>
    );
};

const CommentInput = ({onAddComment, parentCommentId}) => {
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

    const canRegisterComment = () => {
        return currentUser && currentUser['mbti_type'] !== null
    }

    const isDisabled = () => {
        return !canRegisterComment();
    }

    return (
        <div className={style.comment_input_container}>
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

            <div className={style.comment_input_buttons_container}>
                <button onClick={handleAddComment} style={{width: '100px'}} disabled={isDisabled()}>댓글 등록</button>
            </div>
        </div>
    );
};

const CommentBox = ({postId}) => {
    const currentUser = useContext(UserContext)
    const [comments, setComments] = useState([]);

    useEffect(() => {
        handleGetComment()
    }, [postId]);

    const handleGetComment = () => {
        apiClient.get(`/api/posts/${postId}/comments/`)
            .then(response => {
                console.log('get comments successful:', response.data);
                setComments(response.data);
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
        apiClient.post(`/api/posts/${postId}/comments/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetComment();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handlePutComment = (commentId, content) => {
        const data = {
            content: content
        };
        apiClient.put(`/api/posts/${postId}/comments/${commentId}/`, data)
            .then(response => {
                console.log('put comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetComment();
            })
            .catch(error => {
                console.error('Error during put comments:', error.response.data.error);
            })
    }

    const handleDeleteComment = (commentId) => {
        apiClient.delete(`/api/posts/${postId}/comments/${commentId}/`)
            .then(response => {
                console.log('delete comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetComment();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handleAddLikeComment = (commentId, isLikeOn) => {
        const data = {
            recommend: isLikeOn ? 1 : 0
        };

        apiClient.post(`/api/posts/${postId}/comments/${commentId}/recommend/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetComment();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }


    return (
        <div className={style.comment_box}>
            <CommentList comments={comments}
                         onAddComment={handlePostComment}
                         onUpdateComment={handlePutComment}
                         onDeleteComment={handleDeleteComment}
                         onAddLikeComment={handleAddLikeComment}/>
            <hr/>
            <CommentInput postId={postId} onAddComment={handlePostComment}/>
        </div>
    );
}

export default CommentBox;

