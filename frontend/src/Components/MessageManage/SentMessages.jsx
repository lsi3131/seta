import React from 'react'
import style from './MessageManage.module.css'
import { Link } from 'react-router-dom'
import { formatDateDayBefore } from '../../Utils/helpers'

const SentMessages = ({ messages }) => {
    return (
        <div className={style.board_container}>
            <table className={style.board_table}>
                <thead>
                    <tr className={style.board_header}>
                        <th className={style.board_check}>
                            <input type="checkbox" />
                        </th>
                        <th className={style.board_header_item}>받는사람</th>
                        <th className={style.board_header_item}>제목</th>
                        <th className={style.board_header_item}>날짜</th>
                        <th className={style.board_header_item}>수신상태</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.results.map((message) => (
                        <tr key={message.id} className={style.board_message}>
                            <td className={style.board_message_check}>
                                <input type="checkbox" />
                            </td>
                            <td className={style.board_message_sender}>
                                <p>
                                    <Link to={`/profile/${message.recipient__username}/`}>
                                        {message.recipient__username}
                                    </Link>
                                </p>
                            </td>
                            <td className={style.board_message_subject}>
                                <Link to={`/message/${message.id}`}>{message.subject}</Link>
                            </td>
                            <td className={style.board_message_timestamp}>
                                <span>{message.timestamp}</span>
                                <span className={style.board_message_timestamp_small}>
                                    ({formatDateDayBefore(message.timestamp)})
                                </span>
                            </td>
                            <td className={style.board_message_body}>
                                <p>차단</p>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <th>삭제</th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default SentMessages
