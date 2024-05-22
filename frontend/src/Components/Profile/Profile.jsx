
import style from "./Profile.module.css";
import ProfileMBTIForm from "../ProfileMBTIForm/ProfileMBTIForm";
import { Link, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import apiClient from "services/apiClient";
import { UserContext } from "userContext";
import {formatDate, mbtiParams, getImage, getFontColor, getButtonColor} from "../../Utils/helpers"
import ProfileMyPost from "Components/ProfileMyPost/ProfileMyPost";
import ProfileTop from "./ProfileTop/ProfileTop";



const Profile = () => {
    const [users, setUsers] = useState({})
    const [error, setError] = useState(null)
    const currentUser = useContext(UserContext)

    useEffect(() => {
        async function fetchData() {
            try{
                const response = await apiClient.get(`api/accounts/alicia46/`)
                setUsers(response.data)
                console.log(users)
                // ${currentUser.username}
            } catch (error) {
                setError('데이터를 불러오는데 실패했습니다.')
            }
        }
        fetchData();
    }, []);


    return (
        <div className={style.vertical}>
            <ProfileTop users={users}/>
            <ProfileMBTIForm />
            <ProfileMyPost props={users}/>
        </div>
    )
}

export default Profile
