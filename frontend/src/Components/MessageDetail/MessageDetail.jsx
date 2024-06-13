import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import apiClient from 'services/apiClient'
import { formatDate } from '../../Utils/helpers'
import style from './MessageDetail.module.css'
import { UserContext } from 'userContext'

const handleReply = async (data) => {
    try {
        await apiClient.post('/api/messages/', data)
        alert('메시지가 전송되었습니다.')
        window.location.href = '/messages/'
    } catch (error) {
        console.error('메시지 전송에 실패했습니다.', error)
    }
}

const Modal = ({ title, onClose, onSubmit }) => {
    const [data, setData] = useState({ subject: '', body: '' })

    const [recipientMessage, setRecipientMessage] = useState('')


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <div className={style.modalHeader}>
                    <h2>{title}</h2>
                    <button onClick={onClose} className={style.closeButton}>
                        &times;
                    </button>
                </div>

                <div className={style.modalBody}>
                    <label>제목</label>
                    <input type="text" name="subject" value={data.subject} onChange={(e)=> {
                        if (e.target.value.length <= 50) {
                            handleChange(e)
                            setRecipientMessage('')
                        } else {
                            setRecipientMessage('제목은 50자 이내로 작성해주세요.')
                        }

                    }}/>
                    <label>내용</label>
                    <textarea name="body" rows={10} value={data.body} onChange={(e) => {
                        if (e.target.value.length <= 400) {
                            if (e.target.scrollHeight > 200) {
                                e.target.style.height = '200px'
                                setRecipientMessage('내용은 10줄 이내로 작성해주세요.')
                            } else {
                                handleChange(e)
                                setRecipientMessage('')
                            }
                        } else {
                            setRecipientMessage('내용은 400자 이내로 작성해주세요.')
                        }

                    }}/>
                </div>
                <div className={style.recipientMessage}>
                    <p>{recipientMessage}</p>
                </div>

                <div className={style.modalFooter}>
                    <button onClick={onClose} className={style.cancelButton}>
                        취소
                    </button>
                    <button onClick={() => onSubmit(data)} className={style.submitButton}>
                        전송
                    </button>
                </div>
            </div>
        </div>
    )
}

const MessageDetail = () => {
    const {messageId} = useParams()
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const currentUser = useContext(UserContext)
    const [viewModal, setViewModal] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        async function fetchMessage() {
            try {
                const response = await apiClient.get(`/api/messages/${messageId}/`)
                setMessage(response.data)
            } catch (error) {
                setError('메세지가 삭제되었거나 존재하지 않습니다.')
            }
        }
        fetchMessage()
    }, [messageId])

    if (error) {
        return <div>{error}</div>
    }

    if (!message) {
        return <div>로딩 중...</div>
    }

    const handleDelete = async (messageId) => {
        try {
            await apiClient.delete(`/api/messages/${messageId}/`)
            alert('메시지가 삭제되었습니다.')
            navigate('/messages/')
        } catch (error) {
            console.error('메시지 삭제에 실패했습니다.', error)
        }
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.header}>
                    <h2>{message.subject}</h2>
                    <p>
                        {message.sender === currentUser.username ? '받는 사람' : '보낸 사람'}
                        {' : '}
                        {message.sender === currentUser.username ? (
                            <Link to={`/profile/${message.recipient}`}>{message.recipient}</Link>
                        ) : (
                            <Link to={`/profile/${message.sender}`}>{message.sender}</Link>
                        )}
                    </p>
                    <p>받은 날짜 : {formatDate(message.timestamp)}</p>
                </div>
                {message.parent && (
                    <div className={style.originalMessage}>
                        <p>
                            <Link to={`/message/${message.parent.id}`}>{message.parent.subject}</Link> 에 대한
                            답글입니다
                        </p>
                    </div>
                )}
                <div className={style.body}>
                    <p>{message.body}</p>
                </div>
                <div className={style.actions}>
                    <button className={style.backButton} onClick={() => navigate(-1)}>
                        뒤로가기
                    </button>
                    {message.sender !== currentUser.username && (
                        <button className={style.replyButton} onClick={() => setViewModal(true)}>
                            답장
                        </button>
                    )}

                    <button className={style.deleteButton} onClick={() => handleDelete(message.id)}>
                        삭제
                    </button>
                </div>
            </div>
            {viewModal && (
                <Modal
                    title="답장"
                    onClose={() => setViewModal(false)}
                    onSubmit={(data) =>
                        handleReply({
                            ...data,
                            recipient: message.sender,
                            subject: `Re: ${data.subject}`,
                            sender: currentUser.username,
                            parent_message: message.id,
                        })
                    }
                />
            )}
        </>
    )
}

export default MessageDetail
