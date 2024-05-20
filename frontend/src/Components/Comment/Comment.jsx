import React, {useEffect, useState} from 'react';
import style from './Comment.module.css'
import {getButtonColor, getUpdateTime} from "../../Utils/helpers";
import {getCommentsByPostId} from "../../api/services/CommentService";
import like from "../../Assets/images/comment/like.png"

const Comment = ({
                     username,
                     userId,
                     accessToken,
                     articleId,
                     comment,
                     onDeleteComment,
                     onUpdateComment,
                     onAddComment,
                 }) => {
    const [addCommentModeOn, setAddCommentModeOn] = useState(false);
    const [content, setContent] = useState('');
    const [recommendList, setRecommendList] = useState(comment.recommend)

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
                                <button><img src={like} alt=""/></button>
                                <p>{comment.recommend}</p>
                            </div>
                        </div>
                    </div>
                    <div className={style.comment_right}>
                        <div className={style.comment_right_button}>
                            <button>대댓글</button>
                            <button>공감</button>
                            <button>쪽지</button>
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
                            accessToken={accessToken}
                            username={username}
                            userId={userId}
                            comment={child}
                        />
                    </div>
                </>
            ))}
        </div>
    );
};

const CommentList = ({comments}) => {
    return (
        <div className={style.comment_list}>
            {comments.map((comment, index) => (
                <>
                    <hr/>
                    <Comment key={index} comment={comment}/>
                </>
            ))}
        </div>
    );
};

const CommentInput = ({username, onAddComment, parentCommentId}) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
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
                <p></p>
                <button onClick={handleSubmit} style={{width: '100px'}}>댓글 등록</button>
            </div>
        </div>
    );
};

const CommentBox = ({postId, userId, username}) => {
    const accessToken = localStorage.getItem('accessToken')
    // sessionStorage
    const [comments, setComments] = useState([]);

    useEffect(() => {
        handleGetComment()
    }, [postId]);

    const handleGetComment = () => {
        getCommentsByPostId(postId)
            .then(response => {
                console.log('get comments successful:', response.data);
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    };

    return (
        <div>
            <CommentInput postId={postId} username={username}/>
            <CommentList comments={comments}/>
        </div>
    );
};

export default CommentBox;

