import React, { useState } from 'react';
import Modal from 'react-modal';
import style from './Report.module.css'

const Report = () => {
    const [modalIsOpen, setIsOpen] = useState(false);


    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={style.customStyles}
            >
                <h2>신고</h2>
                    <p>신고 하겠습니까??</p>
                <div>
                    <button onClick={closeModal}>취소</button>
                    <button onClick={closeModal}>예</button>
                </div>
            </Modal>
        </div>
    )
}

export default Report