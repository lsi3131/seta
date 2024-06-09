import style from './GameSettingModal.module.css'
import React, {useEffect, useState} from "react";
import './GameSettingModal.module.css'
import apiClient from "../../services/apiClient";
import {useGameSetting} from "./GameSettingProvider";

const GameSettingModal = () => {
    const {setGameSetting, setShowSetting} = useGameSetting();
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
    })

    const handleInputChange = (e) => {
        const {value, name } = e.target
        setInputs({
            ...inputs,
            [name]: value,
        })
    }


    const handleClose = () => {
        setShowSetting(false)
    }

    const handleCreate = () => {
        setGameSetting({
            title: inputs.title,
            description: inputs.description,
        })
        setShowSetting(false)
    }

    return (
        <div className={`${style.modalBackdrop} ${style.show}`}>
            <div className={`${style.modal} ${style.showModal}`}>
                <button className={style.modalClose} onClick={handleClose}>
                    &times;
                </button>
                <div className={style.container}>
                    <div className={style.container_title}>
                        <h2>게임 설정 만들기</h2>
                    </div>
                    <div className={style.container_input}>
                        <div className={style.container_input_name}>
                            <p>제목:</p>
                            <input type="text" name="title" value={inputs.title} placeholder="방제목을 입력해주세요"
                                   onChange={handleInputChange}>
                            </input>

                        </div>
                        <p>세계관 설정</p>
                        <textarea
                            name="description"
                            placeholder="게임 세계관에 대해 설정해 주세요."
                            value={inputs.description}
                            onChange={handleInputChange}
                            rows={10}>
                            </textarea>
                    </div>

                    <div className={style.container_create_button}>
                        <button onClick={handleCreate}>설정</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameSettingModal;