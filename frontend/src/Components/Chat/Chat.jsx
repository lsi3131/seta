import React, {useEffect, useState, useContext} from 'react'
import style from './Chat.module.css'
import apiClient from '../../services/apiClient'
import {UserContext} from '../../userContext'
import ChatList from './ChatList'
import GameList from './GameList'
import Pagination from '../Pagenation/Pagination'
import ChatRoomCreateModal from './ChatRoomCreateModal'
import ChatRoomPasswordModal from './ChatRoomPasswordModal'
import {useNavigate} from 'react-router-dom'

const Chat = () => {
    const currentUser = useContext(UserContext)
    const [view, setView] = useState('chat')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [posts, setPosts] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateRoom, setShowCreateRoom] = useState(false)
    const [showCheckPassword, setShowCheckPassword] = useState(false)
    const [roomId, setRoomId] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        refreshList()

        const interval = setInterval(refreshList, 10000)

        return () => clearInterval(interval)
    }, [view, currentPage, totalPage])

    const refreshList = async () => {
        async function fetchData() {
            if (view !== 'game') {
                try {
                    const response = await apiClient.get(`api/chats/?category=${view}&page=${currentPage}`)
                    setPosts(response.data['results'])
                    setCurrentPage(currentPage)
                    setTotalPage(response.data['total_page'])
                    setIsLoading(false)
                } catch (error) {
                    console.error(error)
                }
            }
        }

        await fetchData()
    }
    const navigateToRoom = ({category, roomId, password}) => {
        let roomType = 'chatroom'
        if (category === 'game') {
            roomType = 'gameroom'
        } else if (category === 'chat') {
            roomType = 'chatroom'
        }
        navigate(`/${roomType}/${roomId}`, {state: {password: password}})
    }

    if (isLoading) {
        return <div>Loading...</div>
    }


    const handleLinkClick = (e, post) => {
        e.preventDefault()

        if (post.blacklist_users && post.blacklist_users.includes(currentUser.username)) {
            alert('강퇴된 사용자입니다. 접근할 수 없습니다.')
            return
        }

        if (post.members_count >= post.max_members) {
            alert('채팅방 정원이 초과되었습니다.')
            return
        }

        // 이미 채팅방 멤버인 경우 바로 채팅방으로 이동
        if (post.members.includes(currentUser.username)) {
            alert('이미 채팅방에 참여하고 있습니다.')
            return
        }

        if (post.blacklist_users && post.blacklist_users.includes(currentUser.username)) {
            alert('강퇴된 사용자입니다. 접근할 수 없습니다.')
            return
        }

        if (post['is_secret']) {
            // 비밀번호 인증 모달창 띄우기
            setRoomId(post.id)
            setShowCheckPassword(true)
        } else {
            // 채팅방으로 이동
            const password = ''
            navigate(`/chatroom/${post.id}`, {state: {password: password}})
        }
    }

    const handleCreateRoom = async (roomId, password, category) => {
        navigateToRoom({category: category, roomId, password: password})
    }

    const handleCloseCreateRoom = async () => {
        setShowCreateRoom(false)
    }

    const handleEnterRoom = (roomId, password, category) => {
        navigateToRoom({category: category, roomId, password: password})
    }

    const handleClosePassword = () => {
        setShowCheckPassword(false)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleViewChange = (view) => {
        setView(view)
    }


    return (
        <div>
            <div className={style.chat_container}>
                {showCheckPassword && (
                    <ChatRoomPasswordModal onEnter={handleEnterRoom} onClose={handleClosePassword} roomId={roomId}/>
                )}
                {showCreateRoom && <ChatRoomCreateModal onCreate={handleCreateRoom} onClose={handleCloseCreateRoom}/>}

                <div className={style.chat_header}>
                    <button onClick={() => window.location.reload()}>새로고침</button>
                    <button onClick={() => {
                        !currentUser.username ? window.location.href = '/login' : setShowCreateRoom(true)
                    }}>방만들기
                    </button>
                </div>

                <div className={style.chat_category}>
                    <button
                        style={{fontWeight: view === 'chat' ? 'bold' : '200'}}
                        onClick={() => handleViewChange('chat')}
                    >
                        채팅
                    </button>
                    <button
                        style={{fontWeight: view === 'game' ? 'bold' : '200'}}
                        onClick={() => handleViewChange('game')}
                    >
                        게임
                    </button>
                    <hr/>
                    {view === 'chat' ? (
                        <ChatList posts={posts} user={currentUser} onChatClick={handleLinkClick}/>
                    ) : (
                        <GameList posts={posts} user={currentUser}/>
                    )}
                    <div>
                    </div>
                </div>
                {(view === 'chat') && (
                    <>
                        <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePageChange}/>
                    </>)}
                <div className={style.chat_footer}></div>
            </div>
        </div>
    )
}

export default Chat
