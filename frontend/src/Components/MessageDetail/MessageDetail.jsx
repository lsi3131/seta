import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiClient from 'services/apiClient'
import { formatDate } from '../../Utils/helpers'
import style from './MessageDetail.module.css'
import { UserContext } from 'userContext'

const MessageDetail = () => {
    const { messageId } = useParams()
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const currentUser = useContext(UserContext)

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

    return (
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
            <div className={style.body}>
                <p>{message.body}</p>
            </div>
            <div className={style.actions}>
                {message.sender !== currentUser.username && (
                    <Link to={`/message/compose?reply_to=${message.id}`} className={style.replyButton}>
                        답장
                    </Link>
                )}
                <button className={style.deleteButton} onClick={() => handleDelete(message.id)}>
                    삭제
                </button>
            </div>
        </div>
    )
}

async function handleDelete(messageId) {
    try {
        await apiClient.delete(`/api/messages/${messageId}/`)
        alert('메시지가 삭제되었습니다.')
        window.location.href = '/messages/'
    } catch (error) {
        console.error('메시지 삭제에 실패했습니다.', error)
    }
}

export default MessageDetail
