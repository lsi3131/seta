import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import style from './NavBar.module.css'
import { UserContext } from 'userContext'

const containerStyles = {
    width: '1200px',
    margin: '0 auto',
}

const logo_image = {
    url: require('../../Assets/images/logo.png'),
}

const AuthenticatedNavbar = ({ username }) => {
    const navigate = useNavigate()
    return (
        <header className={style.header}>
            <div className={style.container}>
                <div className={style.logo}>
                    <Link to="/">
                        <img src={logo_image.url} className={style.image} />
                    </Link>
                </div>
                <nav className={style.navbar}>
                    <Link to={`/profile/${username}/`} style={{ textDecoration: 'none' }}>
                        {username}
                    </Link>

                    <Link to={`/write/`} style={{ textDecoration: 'none' }}>
                        글쓰기
                    </Link>
                    <a
                        onClick={() => {
                            localStorage.removeItem('accessToken')
                            localStorage.removeItem('refreshToken')
                            if (window.location.pathname.includes('profile')) {
                                navigate('/')
                            }
                            window.location.reload()
                        }}
                    >
                        로그아웃
                    </a>
                </nav>
            </div>
        </header>
    )
}

// 인증되지 않은 사용자를 위한 네비게이션
const UnauthenticatedNavbar = ({ currentUrl }) => {
    return (
        <header className={style.header}>
            <div className={style.container}>
                <div className={style.logo}>
                    <Link to="/">
                        <img src={logo_image.url} className={style.image} />
                    </Link>
                </div>
                <nav className={style.navbar}>
                    <Link
                        to={`/login?redirectUrl=${encodeURIComponent(currentUrl)}`}
                        style={{ textDecoration: 'none' }}
                    >
                        로그인
                    </Link>
                </nav>
            </div>
        </header>
    )
}
const Navbar = () => {
    const currentUser = useContext(UserContext)
    const [currentUrl, setCurrentUrl] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setCurrentUrl(window.location.pathname + window.location.search)
    }, [navigate])

    return (
        <div>
            {currentUser ? (
                <AuthenticatedNavbar username={currentUser.username} />
            ) : (
                <UnauthenticatedNavbar currentUrl={currentUrl} />
            )}
        </div>
    )
}
export default Navbar
