import style from './Footer.module.css'
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'Components/Modal/Modal.jsx'
import { UserContext } from 'userContext'
import apiClient from 'services/apiClient'
import useDebounce from '../MessageManage/useDebounce'

const Footer = () => {
    const [isModalOpen, setModalOpen] = useState(false)

    const isModalOppen = () => {
        setModalOpen(true)
    }

    const isModalClose = () => {
        setModalOpen(false)
        setBody('')
        setSubject('')
        setRecipientMessage('')
    }

    const currentUser = useContext(UserContext)
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [recipientMessage, setRecipientMessage] = useState('')

    const handleSend = () => {
        if (!subject) {
            setRecipientMessage(`질문에 제목이 없습니다`)
        } else if (!body) {
            setRecipientMessage(`질문에 내용이 없습니다`)
        } else {
            apiClient
                .post('api/messages/', {
                    sender: currentUser.username,
                    recipient: 'admin',
                    subject: `질문:${subject}`,
                    body: body,
                })
                .then(() => {
                    alert('질문을 보냈습니다')
                    window.location.reload()
                })
            setModalOpen(false)
        }
    }
    if (window.location.pathname === '/login') return null

    return (
        <div className={style.vertical}>
            <div className={style.footer}>
                <div className={style.button}>
                    <Link to="/" className={style.home}>
                        HOME
                    </Link>
                </div>
                <div className={style.button}>
                    <button onClick={isModalOppen}>Q&A</button>
                </div>
            </div>
            <div className={style.footer_botton}>
                <p>
                    2024 <span>세</span>상의 모든 <span>타</span>입
                </p>
            </div>
            {isModalOpen && (
                <Modal ModalStyles={{ width: '400px', height: '400px' }}>
                    <div className={style.top_title}>
                        <h2 className={style.title}>Q&A</h2>
                    </div>
                    <div className={style.createMessage}>
                        <div>
                            <input
                                type="text"
                                className={style.input_subject}
                                placeholder="제목"
                                value={subject}
                                onChange={(e) => {
                                    if (e.target.value.length > 100) {
                                        setRecipientMessage(`제목은 100자를 넘을 수 없습니다`)
                                        return
                                    }
                                    setSubject(e.target.value)
                                    setRecipientMessage('')
                                }}
                            />
                            <textarea
                                placeholder="내용"
                                className={style.input_content}
                                value={body}
                                onChange={(e) => {
                                    if (e.target.value.length <= 400) {
                                        {
                                            /* font 크기가 20 이니까 scrollHeight 로 10줄 이상 작성 못하게 만들거야 */
                                        }
                                        if (e.target.scrollHeight > 200) {
                                            e.target.style.height = '200px'
                                            setRecipientMessage('Q&A는 10줄 이내로 작성해주세요.')
                                        } else {
                                            setBody(e.target.value)
                                            setRecipientMessage('')
                                        }
                                    } else {
                                        setRecipientMessage('Q&A는 400자 이내로 작성해주세요.')
                                    }
                                }}
                            />
                            <div className={style.recipientMessage}>
                                <p>{recipientMessage}</p>
                            </div>
                            <div className={style.button_container}>
                                <button className={style.Button} onClick={isModalClose}>
                                    취소
                                </button>
                                <button className={style.Button} onClick={handleSend}>
                                    보내기
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Footer
