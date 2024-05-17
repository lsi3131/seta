import style from "./Home.module.css";
import React from "react";
import BoardCardList from "../BoardCard/BoardCard";
import ImageSlider from "../ImageSlider/ImageSlider";

const Home = () => {
    const slides = [
        { url: "http://via.placeholder.com/1200x501", title: "image1"},
        { url: "http://via.placeholder.com/1200x502", title: "image2"},
        { url: "http://via.placeholder.com/1200x503", title: "image3"},
        { url: "http://via.placeholder.com/1200x504", title: "image4"}
    ];

    const containerStyles = {
        width: "1200px",
        height: "500px",
        margin: "0 auto"
    }
    return (
        <div>
            <div style={containerStyles}>
                <ImageSlider slides={slides} />
            </div>

            <h1>MBTI 게시판</h1>
            <BoardCardList/>
        </div>
    )
}

export default Home;
