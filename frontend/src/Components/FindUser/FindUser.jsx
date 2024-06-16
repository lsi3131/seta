import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./FindUser.module.css";
import { Link } from 'react-router-dom'
import apiClient from "../../services/apiClient";

const FindUser = () => {
    const [username_email, setUserNameEmail] = useState("");
    const [password_email, setPasswordEmail] = useState("");
    const [username, setUsername] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [codeModalOpen, setCodeModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [modalEmail, setModalEmail] = useState("");
    const [usernameEmailError, setUsernameEmailError] = useState("");
    const [passwordEmailError, setPasswordEmailError] = useState("");
    const [EmailCodeError, setEmailCodeError] = useState("");
    const [passwordButton, setPasswordButton] = useState(false)
    const [codeInput, setCodeInput] = useState(false)
    const [emailCode, setEmailCode] = useState("")
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        let intervalId;
    
        if (timerActive && timer > 0) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timerActive && timer === 0) {
            setEmailCodeError('인증번호 입력 시간이 초과했습니다');
            clearInterval(intervalId); // 타이머가 0에 도달하면 인터벌을 멈춤
        }
    
        return () => clearInterval(intervalId);
    }, [timerActive, timer]);

    const startTimer = (durationInSeconds) => {
        setTimer(durationInSeconds);
        setTimerActive(true);
    };

    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    const handleFindNameSubmit = async (e) => {
        e.preventDefault();
        if (username_email === '') {
            setUsernameEmailError("이메일을 입력해 주세요.");
            return;
        }
        if (!validateEmail(username_email)) {
            setUsernameEmailError("올바르지 않은 이메일 주소입니다.");
            return;
        }
        setModalEmail(username_email)
        setUsernameEmailError('')
        try {
            setModalOpen(true);
            const response = await apiClient.get(`/api/accounts/${username_email}/findname/`);
        } catch (error) {
            setErrorModalOpen(true)
        }
    };

    const handleFindPasswordSubmit = async (e) => {
        e.preventDefault();
        setModalEmail(password_email)
        try {
            setCodeModalOpen(false);
            setPasswordModalOpen(true);
            const response = await apiClient.put(`/api/accounts/${password_email}/${username}/findpassword/`);
        } catch (error) {
            setErrorModalOpen(true)
        }
    };

    const handleFindPasswordCode = async (e) => {
        e.preventDefault();
        if (username === '' ) {
            setPasswordEmailError("username을 입력해 주세요");
            return;
        }
        if (password_email === '') {
            setPasswordEmailError("이메일을 입력해 주세요");
            return;
        }
        if (!validateEmail(password_email)) {
            setPasswordEmailError("올바르지 않은 이메일 주소입니다.");
            return;
        }
        setModalEmail(password_email)
        setPasswordEmailError('')
        try {
            setCodeModalOpen(true);
            startTimer(180);
            const response = await apiClient.get(`/api/accounts/${password_email}/${username}/findpassword/`);
        } catch (error) {
            setErrorModalOpen(true)
        }
    };


    const handleFindPasswordCodeDelete = async (e) => {
        e.preventDefault();
        if (emailCode === ''){
            setEmailCodeError('인증번호를 입력해 주세요')
            return
        }
        setModalEmail(password_email)
        setEmailCodeError('')
        try {
            setCodeModalOpen(true);
            const response = await apiClient.delete(`/api/accounts/${password_email}/${username}/findpassword/`, {
                data: { code: emailCode }
            });
            setCodeInput(true)
            setPasswordButton(true);
        } catch (error) {
            setEmailCodeError('인증번호가 틀렸습니다.')
        }
    };


    const closeModal = () => {
        setModalOpen(false);
        setErrorModalOpen(false);
        setCodeModalOpen(false);
        setEmailCode('')
        setPasswordButton(false)
        setCodeInput(false)
        setEmailCodeError('')
        setTimer(0);
        setTimerActive(false);
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
                    <form onSubmit={handleFindPasswordCode}
                        className={style.form} noValidate>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username을 입력하세요"
                            className={style.input}
                        />
                        <input
                            type="email"
                            value={password_email}
                            onChange={(e) => setPasswordEmail(e.target.value)}
                            placeholder="email을 입력하세요"
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
            {codeModalOpen && (
                <div className={style.EmailModal}>
                    <div className={style.ModalVertical_code}>
                        <div className={style.ModalContent}>
                            <h3 className={style.ModalH3}>이메일 인증</h3>
                            <p className={style.ModalP}>'{modalEmail}' 로</p>
                            <p className={style.ModalP}>
                                인증번호를 보냈습니다.</p>
                                <p className={style.ModalP}>
                                    남은 시간: <span>{formatTime()}</span>
                                </p>
                            <form onSubmit={handleFindPasswordCodeDelete}
                            className={style.form_code}>
                                <input
                                        type="text"
                                        value={emailCode}
                                        onChange={(e) => setEmailCode(e.target.value)}
                                        placeholder="인증번호를 입력하세요"
                                        className={style.input_code}
                                        disabled={codeInput} />
                                <input type="submit" value="확인" 
                                className={codeInput ? style.Modalbutton_code_none : style.Modalbutton_code  }
                                disabled={codeInput}/>  
                            </form>
                                <span className={style.span_code}>{EmailCodeError}</span>
                        </div>
                        <div className={style.EmailModal_code_button}>
                            { passwordButton ?
                                (<button onClick={handleFindPasswordSubmit}
                                    className={style.Modalbutton_password}> 임시 비밀번호 요청 </button>) : 
                                (<button disabled className={style.Modalbutton_password_none}
                                > 임시 비밀번호 요청 </button>)
                            }
                                <button className={style.Modalbutton_code}
                                onClick={closeModal}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {passwordModalOpen && (
                <div className={style.EmailModal}>
                    <div className={style.ModalVertical}>
                        <div className={style.ModalContent}>
                            <h3 className={style.ModalH3}>임시 비밀번호</h3>
                            <p className={style.ModalP}>'{modalEmail}' 로</p>
                            <p className={style.ModalP}>
                                임시 비밀번호를 보냈습니다.</p>
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
