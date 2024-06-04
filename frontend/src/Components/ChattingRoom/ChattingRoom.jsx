import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import style from './ChattingRoom.module.css'
import ChatRightBottom from './ChatRightBottom'
import ChatRightTop from './ChatRightTop'
import ChatLeft from './ChatLeft'
import apiClient from '../../services/apiClient'
import { UserContext } from '../../userContext'

const wsBaseURL = process.env.REACT_APP_WS_BASE_URL;

const ChatRoom = () => {
    const location = useLocation()
    const { roomId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [password, setPassword] = useState(location.state?.password || '')
    const [socket, setSocket] = useState(null)
    const [members, setMembers] = useState([])
    const currentUser = useContext(UserContext)

    useEffect(() => {
        const refreshList = async () => {
            async function fetchData() {
                try {
                    const data = {
                        id: roomId,
                        password: password,
                    }
                    await apiClient.post('api/chats/check_room_password/', data)
                    setIsLoading(false)
                } catch (error) {
                    console.error('잘못된 경로로 채팅방에 입장했습니다.', error)
                    navigate('/chat')
                }
            }

            await fetchData()
        }
        refreshList()
    }, [password, navigate, roomId])

    useEffect(() => {
        if (!currentUser) return

        // WebSocket 연결
        const url = `${wsBaseURL}/ws/chat/${roomId}/`
        const socket = new WebSocket(url)

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    message_type: 'enter',
                    username: currentUser.username,
                    message: '',
                }),
            )
        }

        socket.onmessage = (event) => {
            console.log(event.data)
            const message = JSON.parse(event.data)
            if (message.message_type === 'enter' || message.message_type === 'leave') {
                setMembers(message.members)
            }
        }

        const handleBeforeUnload = (event) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        message_type: 'leave',
                        username: currentUser.username,
                        message: '',
                    }),
                )
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        setSocket(socket)

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        message_type: 'leave',
                        username: currentUser.username,
                        message: '',
                    }),
                )
            }
            socket.close()
        }
    }, [currentUser, roomId])

    useEffect(() => {
        const unlisten = navigate((location, action) => {
            if (action === 'PUSH' || action === 'POP') {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(
                        JSON.stringify({
                            message_type: 'leave',
                            username: currentUser.username,
                            message: '',
                        }),
                    )
                    socket.close()
                }
            }
        })

        return () => {
            if (typeof unlisten === 'function') {
                unlisten()
            }
        }
    }, [navigate, socket, currentUser])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className={style.Room_vertical}>
            <div className={style.Room_container}>
                <div className={style.Room_left}>
                    <ChatLeft members={members} />
                </div>
                <div className={style.Room_right}>
                    <ChatRightBottom members={members} socket={socket} />
                </div>
            </div>
        </div>
    )
}

export default ChatRoom
