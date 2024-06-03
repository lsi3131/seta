import style from './ChatRoomCreateModal.module.css'
import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import './ChatRoomCreateModal.module.css'
import apiClient from "../../services/apiClient";

const ChatRoomCreateModal = ({onCreate, onClose}) => {
    const [inputs, setInputs] = useState({
        id: '',
        roomName: '',
        category: '',
        memberCount: 2,
        isSecret: false,
        password: '',
    })

    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        handleGetCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            setInputs({
                ...inputs,
                category: categories[0].name,
            })
        }
    }, [categories])

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
        try{
            const data = {
                name: inputs.roomName,
                category: inputs.category,
                member_count: inputs.memberCount,
                is_secret: inputs.isSecret,
                password: inputs.password,
            }

            apiClient.post(`/api/chats/`, data)
                .then(response => {
                    console.log('success to create chatroom ', response.data)
                    const chatroomId = response.data['chatroom_id']
                    onCreate(chatroomId);
                }).catch(error => {
                    console.log(error)
                    setError(error.response.data['error'])
                // if (!inputs.category) {
                //     setError('카테고리를 선택해주세요')
                // } else if (inputs.memberCount === null) {
                //     setError('인원을 선택해주세요')
                // } else if (!inputs.title) {
                //     setError('방제목을 입력해주세요')
                // } else if (inputs.password) {
                //     setError('방제목을 입력해주세요')
                // }
            })
            navigate(`/chatroom/${inputs.roomName}`)
        } catch (error) {
            console.error('fail to post categories', error)
        }
        
    }

    const handleGetCategories = () => {
        apiClient.get(`/api/chats/category/`)
            .then(response => {
                setCategories(response.data)
            }).catch(error => {
            console.error('fail to load categories', error)
        })
    }

    // 최대인원을 몇명까지 할 것인지 논의 필요
    const memberCountList = [2, 3, 4, 5, 6, 7, 8, 9, 10]

    return (
        <div className={`${style.modalBackdrop} ${style.show}`}>
            <div className={`${style.modal} ${style.showModal}`}>
                <button className={style.modalClose} onClick={handleClose}>
                    &times;
                </button>
                <div className={style.container}>
                    <div className={style.container_title}>
                        <h2>채팅방 만들기</h2>
                    </div>
                    <div className={style.container_input}>
                        <div className={style.container_input_type}>
                            <p>유형:</p>
                            <select
                                name="category"
                                value={inputs.category}
                                onChange={handleInputChange}
                            >
                                {categories.map((category, index) => (
                                    <option key={index} className={style.option} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}

                            </select>
                            <p>인원: </p>
                            <select
                                name="memberCount"
                                value={inputs.memberCount}
                                onChange={handleInputChange}
                            >
                                {memberCountList.map((count, index) => (
                                    <option key={index} className={style.option} value={`${count}`}>
                                        {count}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={style.container_input_name}>
                            <input type="text" name="roomName" value={inputs.roomName} placeholder="방제목을 입력해주세요"
                                   onChange={handleInputChange} onKeyDown={handleKeyDown}>
                            </input>
                        </div>

                        <div className={style.container_input_secret}>
                            <div className={style.container_input_secret_button}>
                                <input type="checkbox" name="isSecret" checked={inputs.isSecret}
                                       onChange={handleInputChange}/><p>비밀글</p>

                            </div>
                            <div className={style.container_input_secret_password}>
                                <p>비밀번호</p>
                                <input type="password" name="password" value={inputs.password} placeholder="비밀번호를 입력해주세요"
                                       onChange={handleInputChange} disabled={!inputs.isSecret} onKeyDown={handleKeyDown}
                                >
                                </input>
                            </div>
                        </div>
                    </div>

                    <div className={style.container_create_button}>
                        <button onClick={handleSubmit}>작성</button>
                    </div>
                    <p className={style.error}>{error}</p>
                </div>
            </div>
        </div>
    );
};

export default ChatRoomCreateModal;