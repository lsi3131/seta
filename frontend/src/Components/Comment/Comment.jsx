import React, {useContext, useEffect, useState} from 'react';
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
                             onCloseComment
                         }) => {
    const [content, setContent] = useState(initialContent)

    useEffect(() => {
        console.log(commentId)
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
            console.log('reply', onAddComment)
            // onAddComment(content, parentId)
        } else if (mode === 'update') {
            console.log('update', content)
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
                     onAddLikeComment
                 }) => {
    const currentUser = useContext(UserContext)
    const [inputModeType, setInputModeType] = useState('')

    useEffect(() => {

    }, [comment]);

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
                    <div className={style.comment_left}>
                        <pre>{comment.content}</pre>
                        <div className={style.comment_left_bottom}>
                            <p>{comment.author}</p>
                            <p>{getUpdateTime(comment.created_at)}</p>
                            <div className={style.comment_left_bottom_like}>
                                <button onClick={handleSetLike}>
                                    {isLikeOn(comment) ?
                                        <img src={like} alt=""/> :
                                        <img src={unlike} alt=""/>
                                    }
                                </button>
                                <p>{comment.recommend.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className={style.comment_right}>
                        <div className={style.comment_right_button}>
                            <button onClick={() => handleInputMode('reply')}>댓글</button>
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
                    <CommentSubInput mode={inputModeType} initialContent="" onAddComment={onAddComment}
                                     onUpdateComment={onUpdateComment}/>
                }
                {inputModeType === 'update' &&
                    <CommentSubInput mode={inputModeType} initialContent={comment.content} onAddComment={onAddComment}
                                     onUpdateComment={onUpdateComment}/>
                }

            </div>
            {comment.children && comment.children.map(child => (
                <>
                    <div className={style.comment_reply_container}>
                        <img src={reply} alt=""/>
                        <Comment
                            key={child.id}
                            onAddComment={onAddComment}
                            onDeleteComment={onDeleteComment}
                            onAddLikeComment={onAddLikeComment}
                            onUpdateComment={onUpdateComment}
                            comment={child}
                        />
                    </div>
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
                <>
                    <hr/>
                    <Comment key={index} comment={comment}
                             onAddComment={onAddComment}
                             onUpdateComment={onUpdateComment}
                             onDeleteComment={onDeleteComment}
                             onAddLikeComment={onAddLikeComment}/>
                </>
            ))}
        </div>
    );
};

const CommentInput = ({onAddComment, parentCommentId}) => {
    const [content, setContent] = useState('');

    const handleAddComment = async (e) => {
        e.preventDefault();
        onAddComment(content, parentCommentId)
        setContent('');
    };

    return (
        <div className={style.comment_input_container}>
            <textarea
                placeholder="댓글을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
            ></textarea>
            <div className={style.comment_input_buttons_container}>
                <button onClick={handleAddComment} style={{width: '100px'}}>댓글 등록</button>
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
        const data = {
            content: content
        };
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
            {currentUser &&
                <CommentInput postId={postId} onAddComment={handlePostComment}/>
            }
            <CommentList comments={comments}
                         onAddComment={handlePostComment}
                         onUpdateComment={handlePutComment}
                         onDeleteComment={handleDeleteComment}
                         onAddLikeComment={handleAddLikeComment}/>

            <Counter/>
        </div>
    );
}

export default CommentBox;

