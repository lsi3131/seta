import React, { useState } from 'react'
import style from './MessageManage.module.css'
import { Link } from 'react-router-dom'
import { formatDateDayBefore } from '../../Utils/helpers'
import apiClient from 'services/apiClient'

const RecivedMessages = ({ messages, onDelete }) => {
    const [selectedMessages, setSelectedMessages] = useState([])

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedMessages(messages.results.map((message) => message.id))
        } else {
            setSelectedMessages([])
        }
    }

    const handleSelectMessage = (event, messageId) => {
        if (event.target.checked) {
            setSelectedMessages((prevSelected) => [...prevSelected, messageId])
        } else {
            setSelectedMessages((prevSelected) => prevSelected.filter((id) => id !== messageId))
        }
    }

    const handleDelete = async () => {
        try {
            await apiClient.delete('api/messages/delete/', { data: { ids: selectedMessages } })
            onDelete(selectedMessages)
            setSelectedMessages([])
        } catch (error) {
            console.error('메시지 삭제에 실패했습니다:', error)
        }
    }

    return (
        <div className={style.board_container}>
            <table className={style.board_table}>
                <thead>
                    <tr className={style.board_header}>
                        <th className={style.board_check}>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedMessages.length === messages.results.length}
                            />
                        </th>
                        <th className={style.board_header_item}>보낸사람</th>
                        <th className={style.board_header_item}>제목</th>
                        <th className={style.board_header_item}>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.results.map((message) => (
                        <tr key={message.id} className={style.board_message}>
                            <td className={style.board_message_check}>
                                <input
                                    type="checkbox"
                                    onChange={(event) => handleSelectMessage(event, message.id)}
                                    checked={selectedMessages.includes(message.id)}
                                />
                            </td>
                            <td className={style.board_message_sender}>
                                <p>
                                    <Link to={`/profile/${message.sender__username}/`}>{message.sender__username}</Link>
                                </p>
                            </td>
                            <td className={style.board_message_subject}>
                                <sup>{message.parent && <span className={style.replyMessageBadge}>답장</span>}</sup>
                                <Link to={`/message/${message.id}`}>{message.subject}</Link>
                            </td>
                            <td className={style.board_message_timestamp}>
                                <span>{message.timestamp}</span>
                                <span className={style.board_message_timestamp_small}>
                                    ({formatDateDayBefore(message.timestamp)})
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedMessages.length > 0 ? (
                <div className={style.delete_section}>
                    <button onClick={handleDelete} disabled={selectedMessages.length === 0}>
                        선택삭제
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default RecivedMessages
