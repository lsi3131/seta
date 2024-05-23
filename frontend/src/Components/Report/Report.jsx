import React, { useState } from 'react';
import Modal from 'react-modal';
import style from './Report.module.css'
import { getButtonColor } from 'Utils/helpers';

const Report = (e) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const author = e.author
    const currentUser = e.mbti

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <div>
            <button className={style.button} onClick={openModal}  >신고</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className = {style.vertica}>
                <div className={style.content} >
                    <h3>!</h3>
                    <h2>신고</h2>
                    <p>'{author}'님을</p>
                    <p>신고 하시겠습니까?</p>
                </div>
                <div className={style.content_button}>
                    <button onClick={closeModal}>아니요</button>
                    <button onClick={closeModal}>네</button>
                </div>
            </Modal>
        </div>
    )
}

export default Report