import style from './GameSetting.module.css'
import React, {useState} from "react";
import './GameSetting.module.css'
import {useGameContext} from "./GameProvider";

const GameSetting = () => {
    const {gameSetting} = useGameContext();
    const {setAndSendGameSetting, setShowSettingModal} = useGameContext()
    const [inputs, setInputs] = useState(gameSetting)

    const handleInputChange = (e) => {
        const {value, name} = e.target
        setInputs({
            ...inputs,
            [name]: value,
        })
    }


    const handleCreate = () => {
        setAndSendGameSetting({
            title: inputs.title,
            instruction: inputs.instruction,
        })
    }

    return (
        <div className={style.container}>
            <div className={style.container_title}>
                <h2>설정</h2>
            </div>
            <div className={style.container_input}>
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
                <button onClick={handleCreate}>게임 만들기</button>
            </div>
        </div>
    );
};

export default GameSetting;