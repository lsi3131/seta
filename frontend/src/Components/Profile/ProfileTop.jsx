import style from "./ProfileTop.module.css";
import {getImage} from "../../Utils/helpers";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../userContext";
import {Link, useNavigate} from "react-router-dom";
import apiClient from "../../services/apiClient";

const ProfileTop = ({user, onFollowUpdate}) => {
    const currentUser = useContext(UserContext)
    const navigate = useNavigate()

    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        console.log(user)
        handleCheckFollow()
    }, [user]);

    const isMyProfile = () => {
        if (currentUser === null) {
            return false
        }

        return currentUser.username === user.username;
    }

    const handleCheckFollow = () => {
        apiClient.get(`/api/accounts/${user.username}/check_follow/`)
            .then(response => {
                console.log(response.data)
                setIsFollowing(response.data['follow'] === 1)
            })
            .catch(error => {
                console.error('fail to follow/unfollow', error)
            })
    }

    const handleFollow = () => {
        apiClient.post(`/api/accounts/${user.username}/follow/`, {
                follow: isFollowing ? 0 : 1,
            })
            .then(response => {
                console.log('success to update response', response)
                onFollowUpdate()
                handleCheckFollow()
            })
            .catch(error => {
                console.error('fail to follow/unfollow', error)
            })
    }

    const editProfile = () => {
        //TODO : profile 수정 페이지 구현시 적용
        // navigate(`/profile/edit/${user.username}`)
    }

    return (
        <div className={style.board_top}>
            <div className={style.board_top_content}>
                <div className={style.board_top_lift}>
                    <div className={style.board_top_text_container}>
                        {user.mbti ?
                            <p>{user.mbti.toUpperCase()}</p> :
                            <p></p>
                        }
                        <h2>{user.username}</h2>
                    </div>
                    <div>
                        <img className={style.board_top_image} src={getImage(user.mbti)} alt=""/>
                    </div>
                </div>
                <div className={style.board_top_right}>
                    <div className={style.board_top_count}>
                        <div>
                            <h2>{user.posts_count}</h2>
                            <p>게시물</p>
                        </div>
                        <div>
                            <h2>{user.followers_count}</h2>
                            <p>팔로워</p>
                        </div>
                        <div>
                            <h2>{user.following_count}</h2>
                            <p>팔로잉</p>
                        </div>
                    </div>
                    <div className={style.board_button}>
                        {isMyProfile() ?
                            (
                                <button onClick={editProfile}>프로필 편집</button>
                            ) : (
                                isFollowing ? (
                                    <button onClick={handleFollow}>언팔로우</button>
                                ) : (
                                    <button onClick={handleFollow}>팔로우</button>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileTop;