import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import style from './NavBar.module.css'

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
                <Link to="/logout" style={{ textDecoration: 'none'}}>로그아웃</Link>
                <Link to={`/profile/${username}/`}>{username}</Link>
            </nav>
        </header>
        
    )
}

// 인증되지 않은 사용자를 위한 네비게이션
const UnauthenticatedNavbar = () => {
    return (
        <header className={style.header}>
            <div className={style.container}>
                <div className={style.logo}>
                    <Link to="/" style={{ textDecoration: 'none'}}>SETA</Link>
                </div>
                <nav className={style.navbar}>
                    <Link to="/login" style={{ textDecoration: 'none'}}>로그인</Link>
                    {/* 테스트용. 추후 삭제*/}
                    <Link to={`/profile/test_istj`} style={{ textDecoration: 'none'}}>프로필</Link>
                </nav>
            </div>
        </header>
    )
}
const Navbar = ({ username }) => {
    return <div style={containerStyles}>{username ? <AuthenticatedNavbar username={username} /> : <UnauthenticatedNavbar />}</div>
}
export default Navbar