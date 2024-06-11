import style from './Home.module.css'
import React, { useEffect } from 'react'
import BoardCardList from '../BoardCard/BoardCard'
import HotList from '../HotList/HotList'
import ImageSlider from '../ImageSlider/ImageSlider'
import { Link } from 'react-router-dom'
import { Cookies } from 'react-cookie';

const Home = () => {
    const slides = [
        { url: require('../../Assets/images/slider_image_mbti_regist.png'), title: 'mbti_regist' },
        { url: require('../../Assets/images/slider_image_my_board.png'), title: 'my_board' },
        { url: require('../../Assets/images/slider_image_hot_post.png'), title: 'hot_post' },
        { url: require('../../Assets/images/slider_image_chat.png'), title: 'chat' },
        
    ]

    const containerStyles = {
        width: '1200px',
        height: '500px',
    }

    //social login 
    useEffect(() => {
        const setTokensFromCookies = () => {
            const cookies = new Cookies();
            const access = cookies.get('access');
            const refresh = cookies.get('refresh');
            
            if (access && refresh) {
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                cookies.remove('access')
                cookies.remove('refresh')
            }
        };
        setTokensFromCookies();
    }, []);

    return (
        <div>
            <div style={containerStyles}>
                <ImageSlider slides={slides} />
            </div>

            <div className={style.mainContainer}>
                <div className={style.leftContainer}>
                    <h2 className={style.textStyle}>MBTI 게시판</h2>
                    <BoardCardList />
                </div>
                <div className={style.rightContainer}>
                    <div className={style.rightInnerContainer}>
                        <h2 className={style.textStyleHot}>인기 게시글</h2>
                        <Link to="/board/hot" style={{ textDecoration: "none" }}>
                            <h4 className={style.textStyleMore}> 더보기 </h4>
                        </Link>
                    </div>
                    <HotList />
                </div>
            </div>
        </div>
    )
}

export default Home
