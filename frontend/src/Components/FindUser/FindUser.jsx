import React, { useState } from "react";
import axios from "axios";
import style from "./FindUser.module.css";

const FindUser = () => {
    const [username_email, setUserNameEmail] = useState("");
    const [password_email, setPasswordEmail] = useState("");
    const [username, setUsername] = useState("");

    const getUrl = (path) => {
        const baseURL = 'http://127.0.0.1:8000';
        return `${baseURL}/${path}`;
    };

    const handleFindNameSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/${username_email}/findname/`);
            console.log(response)
        } catch (error) {
            console.log("실패")
        }
    };

    const handleFindPasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put.getUrl(`/api/${password_email}/${username}/findpassword/`);
            console.log(response)
        } catch (error) {
            console.log("실패")
        }
    };

    return (
        <div>
            <div>
                <h2>아이디 찾기</h2>
                <form onSubmit={handleFindNameSubmit}>
                    <input
                        type="email"
                        value={username_email}
                        onChange={(e) => setUserNameEmail(e.target.value)}
                        placeholder="email을 입력하세요"
                        required
                    />
                    <input type="submit" value="확인" />
                </form>
            </div>
            <div>
                <h2>비밀번호 찾기</h2>
                <form onSubmit={handleFindPasswordSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username을 입력하세요"
                        required
                    />
                    <input
                        type="email"
                        value={password_email}
                        onChange={(e) => setPasswordEmail(e.target.value)}
                        placeholder="email을 입력하세요"
                        required
                    />
                    <input type="submit" value="확인" />
                </form>
            </div>
        </div>
    );
};

export default FindUser;
