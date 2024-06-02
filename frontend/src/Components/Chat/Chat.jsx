// App.js
import { useEffect, useState, useContext } from 'react'
import style from './Chat.module.css'
import apiClient from '../../services/apiClient'
import { UserContext } from '../../userContext'
import ChatList from './ChatList'
import GameList from './GameList'
import Pagination from '../Pagenation/Pagination'

const Chat = () => {
    const currentUser = useContext(UserContext)
    const [view, setView] = useState('chat')
    const [currentPage, setCurrentPage] = useState(1)
    const [posts, setPosts] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiClient.get(`api/chats/?category=${view}&page=${currentPage}`)
                setPosts(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [view, currentPage])

    if (isLoading) {
        return <div>Loading...</div>
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleViewChange = (view) => {
        setView(view)
    }

    return (
        <div className={style.chat_container}>
            <div className={style.chat_header}>
                <button>새로고침</button>
                <button>방만들기</button>
            </div>

            <div className={style.chat_category}>
                <button
                    style={{ fontWeight: view === 'chat' ? 'bold' : '200' }}
                    onClick={() => handleViewChange('chat')}
                >
                    채팅
                </button>
                <button
                    style={{ fontWeight: view === 'game' ? 'bold' : '200' }}
                    onClick={() => handleViewChange('game')}
                >
                    게임
                </button>
                <hr />
                {view === 'chat' ? (
                    <ChatList posts={posts} user={currentUser} />
                ) : (
                    <GameList posts={posts} user={currentUser} />
                )}
            </div>
            <div className={style.chat_footer}></div>
        </div>
    )
}

export default Chat
