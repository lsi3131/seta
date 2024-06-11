import Cursor from "Components/Cursor/Cursor";
import style from './ImageSlider.module.css'
import { useState } from "react";

const ImageSlider = ({ slides }) => {
    const [slide, setSlide] = useState(0);
    const nextSlide = () => {
        setSlide(slide === slides.length -1 ? 0 : slide + 1);
    }
    const prevSlide = () => {
        setSlide(slide === 0 ? slides.length-1 : slide - 1);
    }
    return (
        <div className={style.slider}>
            <div style={{ width: "100%", height:"100%", display:"flex", overflow:"hidden"}}>
                {slides.map((item, idx) => {
                    return <img src={item.url} alt={item.title} key={idx} style={{translate: `${-100*slide}%`}} className={style.slide}/>;
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