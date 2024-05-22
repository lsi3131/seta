import style from "./Profile.module.css";
import ProfileMBTIForm from "../ProfileMBTIForm/ProfileMBTIForm";
import {Link, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import apiClient from "services/apiClient";
import {formatDate, mbtiParams, getImage, getFontColor, getButtonColor} from "../../Utils/helpers"
import ProfileMyPost from "Components/ProfileMyPost/ProfileMyPost";
import ProfileTop from "./ProfileTop/ProfileTop";


const Profile = () => {
    const {username} = useParams();
    const [users, setUsers] = useState({})
    const [error, setError] = useState(null)

    const handleGetUserData = () => {
        apiClient.get(`api/accounts/${username}/`)
            .then(response => {
                setUsers(response.data)
            })
            .catch(error => {
                setError('데이터를 불러오는데 실패했습니다.')
            })
    }

    useEffect(() => {
        handleGetUserData();
    }, [username]);


    if (!users) {
        return <div></div>
    }

    return (
        <div className={style.vertical}>
            <ProfileTop user={users} onFollowUpdate={handleGetUserData}/>
            <ProfileMBTIForm/>
            <ProfileMyPost props={users}/>
        </div>
    )
}

export default Profile
