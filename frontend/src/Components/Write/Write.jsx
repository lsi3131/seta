import style from "./Write.module.css";
import {Link} from "react-router-dom";
import React from "react";

const Write = () => {
    return (
        <div className={style.vertical}>
            <h1>글작성</h1>

            <input type="text"/>

            <textarea rows={4} style={{marginTop: "10px"}}/>

            <button style={{marginTop: "10px"}}>등록</button>
        </div>
    )
}

export default Write;