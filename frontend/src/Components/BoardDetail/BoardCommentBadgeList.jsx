import React from "react";
import style from "./BoardCommentBadgeList.module.css"
import {getButtonColor} from "../../Utils/helpers";

const BoardCommentBadgeList = ({post}) => {
    return (
        <div className={style.root}>
            <h3>다음 타입만 댓글을 쓸 수 있어요</h3>
            <div className={style.badge_list}>
                {post.mbti.map(m => (
                    <p style={{backgroundColor: getButtonColor(m)}}>{m.toUpperCase()}</p>
                ))}
            </div>
        </div>
    )
}

export default BoardCommentBadgeList;