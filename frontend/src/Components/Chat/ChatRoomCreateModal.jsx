import style from './ChatRoomCreateModal.module.css'
import React, {useEffect, useState} from "react";
import './ChatRoomCreateModal.module.css'
import apiClient from "../../services/apiClient";

const ChatRoomCreateModalTest = () => {
    useEffect(() => {

    }, []);

}

const Modal = ({show = true, onClose, children}) => {
    const [inputs, setInputs] = useState({
        id: '',
        roomName: '',
        category: '',
        memberCount: '',
        isSecret: false,
    })

    const [categories, setCategories] = useState([])

    useEffect(() => {
        handleGetCategories();
    }, []);

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

    const handleSubmit = () => {
        if (inputs.category === '') {
            console.log('empty category')
            return
        }

        if (inputs.memberCount === '') {
            console.log('empty member count')
            return
        }


        const data = {
            category_id: inputs.category.id,
        }

        apiClient.post(`/api/chats/`, data)
            .then(response => {
                console.log(response.data)

            }).catch(error => {
            console.error('fail to post categories', error)
        })
    }

    const handleGetCategories = () => {
        apiClient.get(`/api/chats/category/`)
            .then(response => {
                setCategories(response.data)
            }).catch(error => {
            console.error('fail to load categories', error)
        })
    }

    const memberCountList = [2, 3, 4, 5, 6, 7, 8, 9, 10]

    return (
        <div className={`${style.modalBackdrop} ${show ? style.show : ''}`}>
            <div className={`${style.modal} ${show ? style.showModal : ''}`}>
                <button className={style.modalClose} onClick={onClose}>
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
                                <option className={style.option} value="" disabled>
                                    카테고리를 선택해주세요
                                </option>
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
                                <option className={style.option} value="" disabled>
                                    최대 인원을 선택해주세요
                                </option>
                                {memberCountList.map((count, index) => (
                                    <option key={index} className={style.option} value={`${count}`}>
                                        {count}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={style.container_input_name}>
                            <input type="text" name="roomName" value={inputs.rootName} placeholder="방제목을 입력해주세요"
                                   onChange={handleInputChange}>
                            </input>
                        </div>

                        <div className={style.container_input_secret_button}>
                            <input type="checkbox" name="isSecret" checked={inputs.isSecret}
                                   onChange={handleInputChange}/><p>비밀글</p>
                        </div>
                    </div>

                    <div className={style.container_create_button}>
                        <button onClick={handleSubmit}>작성</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Modal;
// export default ChatRoomCreateModal;