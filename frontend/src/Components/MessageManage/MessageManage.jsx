import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import style from './MessageManage.module.css'
import apiClient from 'services/apiClient'
import { formatDateDayBefore, getFontColor, getButtonColor } from '../../Utils/helpers'
import RecivedMessages from './RecivedMessages.jsx'
import SentMessages from './SentMessages'
import CreateMessage from './CreateMessage'
import { UserContext } from 'userContext'
import Pagination from '../Pagenation/Pagination'
import queryString from 'query-string'

const MessageManage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { type, page } = queryString.parse(location.search)

    const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1)
    const [messages, setMessages] = useState(null)
    const [view, setView] = useState(type || 'received')
    const currentUser = useContext(UserContext)

    const handlePageChange = (page) => {
        setCurrentPage(page)
        navigate(`?type=${view}&page=${page}`)
    }

    const handleViewChange = (view) => {
        setView(view)
        setCurrentPage(1) // reset to first page when changing view
        navigate(`?type=${view}&page=1`)
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiClient.get(`api/messages/?type=${view}&page=${currentPage}`)
                setMessages(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [view, currentPage])

    const handleDelete = (deletedIds) => {
        setMessages((prevMessages) => ({
            ...prevMessages,
            results: prevMessages.results.filter((message) => !deletedIds.includes(message.id)),
        }))
    }

    if (!messages) {
        return <div>Loading...</div>
    }

    return (
        <div className={style.board_contents}>
            <div className={style.board_category}>
                <button
                    onClick={() => handleViewChange('received')}
                    style={{ fontWeight: view === 'received' ? 'bold' : '200' }}
                >
                    받은 메세지
                </button>
                <button
                    onClick={() => handleViewChange('sent')}
                    style={{ fontWeight: view === 'sent' ? 'bold' : '200' }}
                >
                    보낸 메세지
                </button>
                <button
                    onClick={() => handleViewChange('create')}
                    style={{ fontWeight: view === 'create' ? 'bold' : '200' }}
                >
                    메세지작성
                </button>
            </div>
            <hr />
            {view === 'received' ? (
                <RecivedMessages messages={messages} onDelete={handleDelete} />
            ) : view === 'sent' ? (
                <SentMessages messages={messages} onDelete={handleDelete} />
            ) : (
                <CreateMessage />
            )}
            {view !== 'create' && messages.total_page > 1 ? (
                <div className={style.board_pagenation}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={messages.total_page}
                        onPageChange={handlePageChange}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default MessageManage
