import React, { useEffect, useState, useContext } from 'react'
import style from './MessageManage.module.css'
import apiClient from 'services/apiClient'
import { Link, useNavigate } from 'react-router-dom'
import { formatDateDayBefore, getFontColor, getButtonColor } from '../../Utils/helpers'
import RecivedMessages from './RecivedMessages.jsx'
import SentMessages from './SentMessages'
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
    }, [navigate, view])

    if (!messages) {
        return <div></div>
    }

    return (
        <div className={style.board_contents}>
            <div className={style.board_category}>
                <button onClick={() => setView('received')}>받은 메세지</button>
                <button onClick={() => setView('sent')}>보낸 메세지</button>
            </div>
            <hr />
            {view === 'received' ? <RecivedMessages messages={messages} /> : <SentMessages messages={messages} />}
        </div>
    )
}
export default MessageManage
