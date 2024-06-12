import Cursor from "Components/Cursor/Cursor";
import style from './ImageSlider.module.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const ImageSlider = ({ slides, user }) => {
    const [slide, setSlide] = useState(0);
    const navigate = useNavigate()
    const nextSlide = () => {
        setSlide(slide === slides.length -1 ? 0 : slide + 1);
    }
    const prevSlide = () => {
        setSlide(slide === 0 ? slides.length-1 : slide - 1);
    }
    const handleImageClick = (title) => {
        if (title === 'hot_post') {
            navigate(`/board/hot`)
        }
        else if (user.username == '') {
            navigate(`/login`)
        }
        else {
            switch (title) {
                case 'mbti_regist':
                    navigate(`/profile/update/${user.username}`)
                    break;
                case 'my_board':
                    navigate(`/board/${user.mbti_type}`)
                    break;
                case 'chat':
                    navigate(`/chat`)
                    break;
                default:
            break;
            }
        }
    }

    return (
        <div className={style.slider}>
            <div style={{ width: "100%", height:"100%", display:"flex", overflow:"hidden"}}>
                {slides.map((item, idx) => {
                    return <img src={item.url} key={idx} style={{translate: `${-100*slide}%`}} 
                    className={style.slide} 
                    onClick={() => handleImageClick(item.title)}
                    />;
                })}
            </div>
            <div className={style.arrowLeft} onClick={prevSlide}>
                <img src={require("../../Assets/images/left_arrow.png")}/>
            </div>
            <div className={style.arrowRight} onClick={nextSlide}>
                <img src={require("../../Assets/images/right_arrow.png")}/>
            </div>
            <span className={style.indicators}>
                {slides.map((_, idx) =>{
                    return (
                        <button key={idx} onClick={()=> setSlide(idx)} className={slide === idx ? style.indicator : style.indicatorInactive}></button>
                    );
                })}
            </span>
        </div>
    );
}

export default ImageSlider;