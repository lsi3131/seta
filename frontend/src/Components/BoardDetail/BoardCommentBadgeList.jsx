import React, {useEffect, useState} from "react";
import style from "./BoardCommentBadgeList.module.css"
import {getButtonColor} from "../../Utils/helpers";

const BoardCommentBadgeList = ({initializePost}) => {
    const [post, setPost] = useState(initializePost);

    useEffect(() => {
        setPost((initializePost))
    }, [initializePost]);

    return (
        <div className={style.root}>
            <hr/>
            <h3>다음 타입만 댓글을 쓸 수 있어요</h3>
            <div className={style.badge_list}>
                {post.mbti.map(m => (
                    <button style={{backgroundColor: getButtonColor(m)}}>{m.toUpperCase()}</button>
                ))}
            </div>
        </div>
    )
}

export default BoardCommentBadgeList;