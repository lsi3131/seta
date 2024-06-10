import React, { useState } from 'react';
import Modal from 'react-modal';
import style from './Report.module.css'
import apiClient from 'services/apiClient'

const Report = (e) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const author = e.author
    const currentUser = e.mbti
    const [body, setBody] = useState('')
    const [recipientMessage, setRecipientMessage] = useState('')


    const openModal = () => {
        setIsOpen(true);
    }

    const handleSend = () => {
        if (!body) {
            setRecipientMessage(`이유를 작성해 주세요`)
        } else{
            apiClient
            .post('api/messages/', {
                sender: currentUser.username,
                recipient: 'admin',
                subject: '신고',
                body: body,
            })
            .then(() => {
                alert('신고 됐습니다')
                window.location.reload()
            })
            setIsOpen(false);
        }
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <div >
            <button className={style.button} onClick={openModal}  >신고</button>
            <div className={style.vertical}>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className = {style.modal}>
                <div className={style.content} >
                    <h3>!</h3>
                    <h2>신고</h2>
                    <p>'{author}'님을</p>
                    <p>신고 하시겠습니까?</p>
                </div>
                <div>
                <textarea
                    placeholder="이유"
                    className={style.input_content}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                <div className={style.recipientMessage}>
                    <p>{recipientMessage}</p>
                </div>
                <div className={style.content_button}>
                    <button onClick={handleSend}>네</button>
                    <button onClick={closeModal}>아니요</button>
                </div>
            </Modal>
            </div>
        </div>
    )
}

export default Report