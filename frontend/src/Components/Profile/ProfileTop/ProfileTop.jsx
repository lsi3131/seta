import style from "../Profile.module.css";
import {getImage} from "../../../Utils/helpers";
import React from "react";

const ProfileTop = ({users}) => {
    return (
        <div className={style.board_top}>
            <div className={style.board_top_content}>
                <div className={style.board_top_lift}>
                    <div className={style.board_top_text_container}>
                        <p>{users.mbti}</p>
                        <h2>{users.username}</h2>
                    </div>
                    <div>
                        <img className={style.board_top_image} src={getImage(users.mbti)}/>
                    </div>
                </div>
                <div className={style.board_top_right}>
                    <div className={style.board_top_count}>
                        <div>
                            {users.posts && <h2>{users.posts.length}</h2>}
                            <p>게시물</p>
                        </div>
                        <div>
                            <h2>{users.followers_count}</h2>
                            <p>팔로워</p>
                        </div>
                        <div>
                            <h2>{users.following_count}</h2>
                            <p>팔로잉</p>
                        </div>
                    </div>
                    <div className={style.boder_top_mbti_box}>
                        {users.mbti &&
                            <div className={style.board_top_mbti}>
                                <h3>{users.mbti[0]}</h3>
                                <p>{Math.floor(users.percentIE)}%</p>
                                <h3>{users.mbti[1]}</h3>
                                <p>{Math.floor(users.percentNS)}%</p>
                                <h3>{users.mbti[2]}</h3>
                                <p>{Math.floor(users.percentFT)}%</p>
                                <h3>{users.mbti[3]}</h3>
                                <p>{Math.floor(users.percentPJ)}%</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileTop;