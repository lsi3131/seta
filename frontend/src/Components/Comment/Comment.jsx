import React, {useContext, useEffect, useState} from 'react';
import style from './Comment.module.css'
import {getButtonColor, getUpdateTime} from "../../Utils/helpers";
import like from "../../Assets/images/comment/like.png"
import unlike from "../../Assets/images/comment/unlike.png"
import apiClient from "../../services/apiClient";
import {UserContext} from "../../userContext";

const Comment = ({comment, onDeleteComment, onAddLikeComment}) => {
    const currentUser = useContext(UserContext)

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

    const submitDeleteComment = () => {
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
                            <button>대댓글</button>
                            <button>공감</button>
                            <button>쪽지</button>
                            {isSameUser(comment) &&
                                <>
                                    <button>수정</button>
                                    <button onClick={submitDeleteComment}>삭제</button>
                                </>
                            }
                            <button>신고</button>
                        </div>
                        <p style={{backgroundColor: getButtonColor(comment.author_mbti)}}>{comment.author_mbti}</p>
                    </div>
                </div>
            </div>
            {comment.children && comment.children.map(child => (
                <>
                    <div className="" style={{marginLeft: "50px"}}>
                        <Comment
                            key={child.id}
                            comment={child}
                        />
                    </div>
                </>
            ))}
        </div>
    );
};

const CommentList = ({comments, username, onDeleteComment, onAddLikeComment}) => {
    return (
        <div className={style.comment_list}>
            {comments.map((comment, index) => (
                <>
                    <hr/>
                    <Comment key={index} comment={comment} onDeleteComment={onDeleteComment} onAddLikeComment={onAddLikeComment}/>
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
                rows={2}
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

    const handlePostComment = (content) => {
        const data = {
            content: content
        };
        apiClient.post(`/api/posts/${postId}/comments/`, data)
            .then(response => {
                console.log('get comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetComment();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
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
            <CommentList comments={comments} onDeleteComment={handleDeleteComment}
                         onAddLikeComment={handleAddLikeComment}/>
        </div>
    );
}

export default CommentBox;

