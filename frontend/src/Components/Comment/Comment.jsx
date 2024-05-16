import React from 'react';
import style from './Comment.module.css'

const CommentBox = () => {
    return (
        <div className={style.vertical}>
            <h1>댓글</h1>
            <input type="text"/>

            <p>인팁인데 개추 누름</p>
        </div>
    )
}

export default CommentBox;

