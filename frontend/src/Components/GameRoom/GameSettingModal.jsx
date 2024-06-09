import style from './GameSettingModal.module.css'
import React, {useState} from "react";
import './GameSettingModal.module.css'
import {useGameContext} from "./GameProvider";

const GameSettingModal = () => {
    const {sendAndSetGameSetting, setShowSettingModal} = useGameContext()
    const [inputs, setInputs] = useState({
        title: '',
        instruction: '',
    })

    const handleInputChange = (e) => {
        const {value, name } = e.target
        setInputs({
            ...inputs,
            [name]: value,
        })
    }


    const handleClose = () => {
        setShowSettingModal(false)
    }

    const handleCreate = () => {
        sendAndSetGameSetting({
            title: inputs.title,
            instruction: inputs.instruction,
        })
        setShowSettingModal(false)
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
                            name="instruction"
                            placeholder="게임 세계관에 대해 설정해 주세요."
                            value={inputs.instruction}
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