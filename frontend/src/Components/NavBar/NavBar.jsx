import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import style from './NavBar.module.css'

const AuthenticatedNavbar = ({ username }) => {
    return (
        <nav className={style.navbar}>
            <div className={style.left}>
                <Link to="/">HOME</Link>
            </div>
            <div className={style.right}>
                <Link to={`/profile/${username}/`}>{username}</Link>
            </div>
        </nav>
    )
}

// 인증되지 않은 사용자를 위한 네비게이션
const UnauthenticatedNavbar = () => {
    return (
        <nav className={style.navbar}>
            <div className={style.left}>
                <Link to="/">HOME</Link>
            </div>
            <div className={style.right}>
                <Link to="/login" style={{marginRight : "10px"}}>LOGIN</Link>
                {/* 테스트용. 추후 삭제*/}
                <Link to={`/profile/test_istj`}>test_istj</Link>
            </div>
        </nav>
    )
}
const Navbar = ({ username }) => {
    return <div>{username ? <AuthenticatedNavbar username={username} /> : <UnauthenticatedNavbar />}</div>
}
export default Navbar