import style from './ChatRoomPasswordModal.module.css'
import React, {useEffect, useState} from "react";
import apiClient from "../../services/apiClient";

const ChatRoomPasswordModal = ({roomId, onEnter, onClose}) => {
    const [inputs, setInputs] = useState({
        password: '',
    })

    const [error, setError] = useState('')

    useEffect(() => {
    }, [roomId]);

    const handleClose = () => {
        onClose()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    const handleInputChange = (e) => {
        const {value, type, name, checked} = e.target
        if (type === 'checkbox') {
            setInputs({
                ...inputs,
                isSecret: checked,
            })
        } else {
            setInputs({
                ...inputs,
                [name]: value,
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            const data = {
                id: roomId,
                password: inputs.password,
            }

            apiClient.post(`/api/chats/check_room_password/`, data)
                .then(response => {
                    console.log('success to create chatroom ', response.data)
                    onEnter(roomId, inputs.password);
                }).catch(error => {
                console.log(error)
                setError(error.response.data['error'])
            })
        } catch (error) {
            console.error('fail to post categories', error)
        }
    }

    return (
        <div className={`${style.modalBackdrop}`}>
            <div className={`${style.modal} ${style.showModal}`}>
                <button className={style.modalClose} onClick={handleClose}>
                    &times;
                </button>
                <div className={style.container}>
                    <div className={style.container_title}>
                        <h2>비밀방</h2>
                    </div>
                    <div className={style.container_input}>
                        <div className={style.container_input_secret}>
                            <div className={style.container_input_secret_password}>
                                <p>비밀번호</p>
                                <input type="password" name="password" value={inputs.password}
                                       placeholder="비밀번호를 입력해주세요"
                                       onChange={handleInputChange} onKeyDown={handleKeyDown}
                                >
                                </input>
                            </div>
                        </div>
                    </div>

                    <div className={style.container_create_button}>
                        <button onClick={handleSubmit}>입장</button>
                    </div>
                    <p className={style.error}>{error}</p>
                </div>
            </div>
        </div>
    );
};

export default ChatRoomPasswordModal;