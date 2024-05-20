import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import style from './NavBar.module.css'
import { UserContext } from 'userContext'

const containerStyles = {
    width: "1200px",
    margin: "0 auto"
}

const AuthenticatedNavbar = ({ username }) => {
    return (
        <header className={style.header}>
            <div className={style.logo}>

                <Link to="/" style={{ textDecoration: 'none'}}>SETA</Link>

            </div>
            <nav className={style.navbar}>
                <Link to={`/profile/${username}/`} style={{ textDecoration: 'none' }}>
                    {username}
                </Link>
                <a
                    onClick={() => {
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken')
                        window.location.href = '/login'
                    }}
                >
                    logout
                </a>
            </nav>
        </header>
    )
}

// 인증되지 않은 사용자를 위한 네비게이션
const UnauthenticatedNavbar = () => {
    return (
        <header className={style.header}>
            <div className={style.logo}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    Logo
                </Link>
            </div>
            <nav className={style.navbar}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    로그인
                </Link>
                {/* 테스트용. 추후 삭제*/}
                <Link to={`/profile/test_istj`} style={{ textDecoration: 'none' }}>
                    프로필
                </Link>
            </nav>
        </header>
    )
}
const Navbar = () => {
    const currentUser = useContext(UserContext)
    console.log(currentUser)
    return (
        <div>{currentUser ? <AuthenticatedNavbar username={currentUser.username} /> : <UnauthenticatedNavbar />}</div>
    )
}
export default Navbar
