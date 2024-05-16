import style from "./Home.module.css";
import React from "react";
import BoardCardList from "../BoardCard/BoardCard";

const Home = () => {
    return (
        <div>
            <h1>상단 회색 박스</h1>

            <h1>MBTI 게시판</h1>
            <BoardCardList/>
        </div>
    )
}

export default Home;
