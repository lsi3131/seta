import style from "./Profile.module.css";
import ProfileMBTIForm from "../ProfileMBTIForm/ProfileMBTIForm";
import {Link, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import apiClient from "services/apiClient";
import ProfileTop from "./ProfileTop";


const Profile = () => {
    const {username} = useParams();
    const [users, setUsers] = useState({})
    const [error, setError] = useState(null)
    const [showProfileMyPost, setShowProfileMyPost] = useState(false);

    const [followingRanks, setFollowingRanks] = useState([])
    const [followerRanks, setFollowerRanks] = useState([])

    const handleGetUserData = () => {
        apiClient.get(`api/accounts/${username}/`)
            .then(response => {
                setUsers(response.data)
            })
            .catch(error => {
                setError('데이터를 불러오는데 실패했습니다.')
            })
    }

    const handleGetRanking = () => {
        apiClient.get(`api/accounts/${username}/ranking/`)
            .then(response => {
                setFollowingRanks(response.data['following'])
                setFollowerRanks(response.data['follower'])
            })
            .catch(error => {
                console.log('fail to get ranking', error)
            })
    }


    const handleToggleShow = () => {
        setShowProfileMyPost(prevState => !prevState);
    };


    useEffect(() => {
        handleGetUserData();
        handleGetRanking();
    }, [username]);


    if (!users) {
        return <div></div>
    }

    return (
        <div className={style.vertical}>
            <ProfileTop user={users} onFollowUpdate={handleGetUserData}/>
            <ProfileMBTIForm user={users} followingRanks={followingRanks} followerRanks={followerRanks}/>
        
        </div>
    )
}

export default Profile
