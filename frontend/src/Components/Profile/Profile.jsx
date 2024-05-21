
import style from "./Profile.module.css";
import ProfileMBTIForm from "../ProfileMBTIForm/ProfileMBTIForm";
import { Link, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import apiClient from "services/apiClient";
import { UserContext } from "userContext";
import {formatDate, mbtiParams, getImage, getFontColor, getButtonColor} from "../../Utils/helpers"
import ProfileMyPost from "Components/ProfileMyPost/ProfileMyPost";



const Profile = () => {
    const { username } = useParams();
    const [users, setUsers] = useState({})
    const [error, setError] = useState(null)
    const currentUser = useContext(UserContext)

    useEffect(() => {
        async function fetchData() {
            try{
                const response = await apiClient.get(`api/accounts/${username}/`)
                setUsers(response.data)
            } catch (error) {
                setError('데이터를 불러오는데 실패했습니다.')
            }
        }
        fetchData();
    }, [username]);


    if (!users){
        return <div></div>
    }

    return (
        <div className={style.vertical}>
            <div className={style.board_top} >
                <div className={style.board_top_content}>
                    <div className={style.board_top_lift}>
                        <div className={style.board_top_text_container}>
                            <p>{users.mbti}</p>
                            <h2>{users.username}</h2>
                        </div>
                        <div>
                            <img className={style.board_top_image} src={getImage(users.mbti)} />
                        </div>
                    </div>
                    <div className={style.board_top_right}>
                        <div className={style.board_top_count}>
                            <div>
                                {users.posts_count && <h2>{users.posts_count}</h2>}
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
            <ProfileMBTIForm />
            <ProfileMyPost props={users}/>
        </div>
    )
}

export default Profile
