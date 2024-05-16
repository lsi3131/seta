import style from "./Login.module.css";
import {Link} from "react-router-dom";
import React from "react";

const Login = () => {
    return (
        <div>
            <h1>로그인 화면</h1>
            <Link to="/signup">회원가입</Link>
        </div>
    )
}

export default Login;