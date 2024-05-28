import React, { useEffect, useState, useContext } from 'react'
import style from './MessageManage.module.css'
import apiClient from 'services/apiClient'
import { Link, useNavigate } from 'react-router-dom'
import { formatDateDayBefore, getFontColor, getButtonColor } from '../../Utils/helpers'
import RecivedMessages from './RecivedMessages.jsx'
import SentMessages from './SentMessages'
import CreateMessage from './CreateMessage'
import { UserContext } from 'userContext'

const MessageManage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [messages, setMessages] = useState(null)
    const [view, setView] = useState('received')
    const currentUser = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiClient.get(`api/messages/?type=${view}&page=${currentPage}`)
                setMessages(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData(currentPage)
    }, [navigate, view, currentPage])

    const handleDelete = (deletedIds) => {
        setMessages((prevMessages) => ({
            ...prevMessages,
            results: prevMessages.results.filter((message) => !deletedIds.includes(message.id)),
        }))
    }

    if (!messages) {
        return <div></div>
    }

    return (
        <div className={style.board_contents}>
            <div className={style.board_category}>
                <button
                    onClick={() => setView('received')}
                    style={{ fontWeight: view === 'received' ? 'bold' : '200' }}
                >
                    받은 메세지
                </button>
                <button onClick={() => setView('sent')} style={{ fontWeight: view === 'sent' ? 'bold' : '200' }}>
                    보낸 메세지
                </button>
                <button onClick={() => setView('create')} style={{ fontWeight: view === 'create' ? 'bold' : '200' }}>
                    메세지작성
                </button>
            </div>
            <hr />
            {view === 'received' ? (
                <RecivedMessages messages={messages} onDelete={handleDelete} />
            ) : view === 'sent' ? (
                <SentMessages messages={messages} onDelete={handleDelete} />
            ) : (
                <CreateMessage></CreateMessage>
            )}
        </div>
    )
}
export default MessageManage
