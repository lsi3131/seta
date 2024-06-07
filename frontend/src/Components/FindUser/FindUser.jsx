import React, { useState } from "react";
import axios from "axios";
import style from "./FindUser.module.css";
import { Link } from 'react-router-dom'
import apiClient from "../../services/apiClient";

const FindUser = () => {
    const [username_email, setUserNameEmail] = useState("");
    const [password_email, setPasswordEmail] = useState("");
    const [username, setUsername] = useState("");
    const [modalOpen, setModalOpen] = useState(false)
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [modalEmail, setModalEmail] = useState("");
    const [usernameEmailError, setUsernameEmailError] = useState("");
    const [passwordEmailError, setPasswordEmailError] = useState("");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    const handleFindNameSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(username_email)){
            setUsernameEmailError("올바르지 않은 이메일 주소입니다.");
            return;
        }
        setModalEmail(username_email)
        try {
            setModalOpen(true);
            const response = await apiClient.get(`/api/accounts/${username_email}/findname/`);
        } catch (error) {
            setErrorModalOpen(true)
        }
    };

    const handleFindPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(password_email)){
            setPasswordEmailError("올바르지 않은 이메일 주소입니다.");
            return;
        }
        setModalEmail(password_email)
        try {
            setModalOpen(true);
            const response = await apiClient.put(`/api/accounts/${password_email}/${username}/findpassword/`);
        } catch (error) {
            setErrorModalOpen(true)
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setErrorModalOpen(false);
    };

    return (
        <div className={style.vertical}>
            <div className={style.content}>
                <div className={style.username}>
                    <h2 className={style.h2}>아이디 찾기</h2>
                    <form onSubmit={handleFindNameSubmit}
                    className={style.form} noValidate>
                        <input
                            type="email"
                            value={username_email}
                            onChange={(e) => setUserNameEmail(e.target.value)}
                            placeholder="email을 입력하세요"
                            required
                            className={style.input}
                        />
                        <span
                        className={style.span}>
                            {usernameEmailError}</span>
                        <input type="submit" value="확인"
                        className={style.button} />
                    </form>
                </div>
                <div className={style.hr}>
                    <hr />
                </div>
                <div className={style.password}>
                    <h2 className={style.h2}>비밀번호 찾기</h2>
                    <form onSubmit={handleFindPasswordSubmit}
                    className={style.form} noValidate>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username을 입력하세요"
                            required
                            className={style.input}
                        />
                        <input
                            type="email"
                            value={password_email}
                            onChange={(e) => setPasswordEmail(e.target.value)}
                            placeholder="email을 입력하세요"
                            required
                            className={style.input}
                        />
                        <span
                        className={style.span}>{passwordEmailError}</span>
                        <input 
                        className={style.button}
                        type="submit" value="확인" />
                    </form>
                </div>
            </div>
            {modalOpen && (
                <div className={style.EmailModal}>
                    <div className={style.ModalVertical}>
                        <div className={style.ModalContent}>
                            <h3 className={style.ModalH3}>이메일 인증</h3>
                            <p className={style.ModalP}>'{modalEmail}' 로</p>
                            <p className={style.ModalP}>
                                이메일을 보냈습니다.</p>
                            <p className={style.ModalP}>이메일을 확인하세요.</p>
                                <Link 
                                className={style.Modalbutton}
                                to="/login">확인</Link>
                        </div>
                    </div>
                </div>
            )}
            {errorModalOpen && (
                <div className={style.EmailModal}>
                    <div className={style.ModalVertical}>
                        <div className={style.ModalContent}>
                            <h3 className={style.ErrorModalH3}>
                                !
                            </h3>
                            <p className={style.ModalP}>
                                이메일 오류</p>
                            <p className={style.ModalP}>'{modalEmail}'</p>
                            <p className={style.ModalP}>
                                이메일이 존제하지 않습니다.</p>

                            <button className={style.Modalbutton} 
                            onClick={closeModal}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindUser;
