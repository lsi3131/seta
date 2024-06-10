import style from './Home.module.css'
import React, { useEffect } from 'react'
import BoardCardList from '../BoardCard/BoardCard'
import HotList from '../HotList/HotList'
import ImageSlider from '../ImageSlider/ImageSlider'
import { Link } from 'react-router-dom'
import { Cookies } from 'react-cookie';

const Home = () => {
    const slides = [
        { url: require('../../Assets/images/slide_image_mbti_test.png'), title: 'mbti_test' },
        { url: 'http://via.placeholder.com/1200x502', title: 'image2' },
        { url: 'http://via.placeholder.com/1200x503', title: 'image3' },
        { url: 'http://via.placeholder.com/1200x504', title: 'image4' },
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
