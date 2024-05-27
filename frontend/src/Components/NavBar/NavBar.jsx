import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import style from './NavBar.module.css'
import { UserContext } from 'userContext'
import { getMainColor } from 'Utils/helpers'
import NavSearch from "./NavSearch";

const logo_image = {
    url: require('../../Assets/images/logo.png'),
}

const AuthenticatedNavbar = ({ currentUser }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const navigate = useNavigate()
    const dropdownRef = useRef(null)

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        if (window.location.pathname.includes(['/profile', '/messages'])) {
            navigate('/')
        }
        window.location.reload()
    }

    const handleDocumentClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    return (
        <header className={style.header}>
            <div className={style.container}>
                <div className={style.logo_search}>
                    <Link to="/">
                        <img src={logo_image.url} className={style.image}/>
                    </Link>
                    <div className={style.search}>
                        <NavSearch/>
                    </div>
                </div>
                <nav className={style.navbar}>
                    <div className={style.usernameWrapper} ref={dropdownRef}>
                        <a className={style.username} onClick={() => setDropdownVisible(!dropdownVisible)}>
                            {currentUser.username}
                        </a>
                        <div
                            style={{ backgroundColor: currentUser ? getMainColor(currentUser.mbti_type) : '#ccc' }}
                            className={`${style.dropdownMenu} ${dropdownVisible ? style.show : ''}`}
                        >
                            <Link to={`/profile/${currentUser.username}/`} className={style.dropdownItem}>
                                프로필
                            </Link>
                            <Link to="/messages/" className={style.dropdownItem}>
                                메세지 관리
                            </Link>
                            <Link to={`/profile/${currentUser.username}/posts`} className={style.dropdownItem}>
                                작성한 글 관리
                            </Link>
                            <hr></hr>
                            <a onClick={handleLogout} className={style.dropdownItem}>
                                로그아웃
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

const UnauthenticatedNavbar = ({ currentUrl }) => {
    return (
        <header className={style.header}>
            <div className={style.container}>
                <div className={style.logo_search}>
                    <Link to="/">
                        <img src={logo_image.url} className={style.image}/>
                    </Link>
                    <div className={style.search}>
                        <NavSearch/>
                    </div>
                </div>
                <nav className={style.navbar}>
                    <Link
                        to={`/login?redirectUrl=${encodeURIComponent(currentUrl)}`}
                        style={{textDecoration: 'none'}}
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

    if (!currentUser) return null
    return (
        <div>
            {currentUser.username === '' ? (
                <UnauthenticatedNavbar currentUrl={currentUrl} />
            ) : (
                <AuthenticatedNavbar currentUser={currentUser} />
            )}
        </div>
    )
}

export default Navbar
