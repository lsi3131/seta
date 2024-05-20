import style from "./Home.module.css";
import React from "react";
import BoardCardList from "../BoardCard/BoardCard";
import ImageSlider from "../ImageSlider/ImageSlider";

const Home = () => {
    const slides = [
        { url: require("../../Assets/images/slide_image_mbti_test.png"), title: "mbti_test"},
        { url: "http://via.placeholder.com/1200x502", title: "image2"},
        { url: "http://via.placeholder.com/1200x503", title: "image3"},
        { url: "http://via.placeholder.com/1200x504", title: "image4"}
    ];

    const containerStyles = {
        width: "1200px",
        height: "500px",
        margin: "0 auto"
    }

    const textStyles = {
        fontSize: "25px",
        fontWeight: "bold",
        margin: "50px 40px"
    }
    return (
        <div>
            <div style={containerStyles}>
                <ImageSlider slides={slides} />
            </div>

            <h2 style={textStyles}>MBTI 게시판</h2>
            <BoardCardList/>
        </div>
    )
}

export default Home;
