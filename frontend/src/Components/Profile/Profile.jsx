import style from "./Profile.module.css";
import {Link, useParams} from "react-router-dom";
import React from "react";

const Profile = () => {
    const {username} = useParams()

    return (
        <div className={style.vertical}>
            <h1>프로필 - {username}</h1>

            <div className={style.horizontal}>
                <p>내가 작성한 글 |</p>
                <p>좋아요</p>
            </div>

            <div>
                <p>작성한 글 리스트</p>
            </div>
        </div>
    )
}

export default Profile;