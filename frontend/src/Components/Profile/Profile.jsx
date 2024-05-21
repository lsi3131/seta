import style from './Profile.module.css'
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

// function getUrl(subUrl) {
//     const urlRoot = 'http://127.0.0.1:8000'
//     return `${urlRoot}${subUrl}`
// }

const Profile = () => {
    const { username } = useParams()
    const [profiles, setProfiles] = useState([])

    useEffect(() => {
        const respones = axios.get('http://127.0.0.1:8000/api/accounts/admin/')
        setProfiles(respones.data)
    }, [])

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

export default Profile
