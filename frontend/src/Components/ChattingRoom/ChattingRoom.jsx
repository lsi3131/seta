import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import style from './ChattingRoom.module.css'
import ChatRightBottom from './ChatRightBottom'
import ChatLeft from './ChatLeft'
import apiClient from '../../services/apiClient'
import { UserContext } from '../../userContext'

const baseURL = process.env.REACT_APP_WS_BASE_URL

const ChatRoom = () => {
    const location = useLocation()
    const { roomId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [password, setPassword] = useState(location.state?.password || '')
    const [socket, setSocket] = useState(null)
    const [members, setMembers] = useState([])
    const currentUser = useContext(UserContext)
    const [host, setHost] = useState('')

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
        const url = `${baseURL}/ws/chat/${roomId}/`
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
            const message = JSON.parse(event.data)
            if (
                message.message_type === 'enter' ||
                message.message_type === 'leave' ||
                message.message_type === 'expel'
            ) {
                setMembers(message.members)
                fetchHost()
            } else if (message.message_type === 'host_change') {
                setHost(message.username)
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
                // 페이지 이탈 시 종료 코드를 설정하여 WebSocket을 닫음
                const closeCode = navigate('/chat', { replace: true }) ? 1000 : 1001
                socket.close(closeCode)
            }
        }
    }, [currentUser, roomId, navigate])

    const handleExpel = (member) => {
        socket.send(
            JSON.stringify({
                message_type: 'expel',
                username: member,
                message: '',
            }),
        )
    }

    const handleLeaveRoom = () => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    message_type: 'leave',
                    username: currentUser.username,
                    message: '',
                }),
            )
        }
        navigate('/chat')
    }

    const fetchHost = async () => {
        try {
            const response = await apiClient.get(`api/chats/${roomId}/`)
            setHost(response.data.host_user)
        } catch (error) {
            console.error('호스트 정보를 가져오는데 실패했습니다.', error)
        }
    }

    const handleHostChange = async (member) => {
        try {
            const data = {
                host_user: member,
            }
            await apiClient.put(`api/chats/${roomId}/`, data)
            setHost(member)
            socket.send(
                JSON.stringify({
                    message_type: 'host_change',
                    username: member,
                    message: '',
                }),
            )
        } catch (error) {
            console.error('방장 위임에 실패했습니다.', error)
        }
    }

    useEffect(() => {
        fetchHost()
    }, [roomId, host])

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

                    // 페이지 이탈 시 종료 코드를 설정하여 WebSocket을 닫음
                    const closeCode = action === 'PUSH' ? 1000 : 1001
                    socket.close(closeCode)
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
                <div>
                    <div className={style.Room_left}>
                        <ChatLeft
                            members={members}
                            host={host}
                            handleHostChange={handleHostChange}
                            handleExpel={handleExpel}
                        />
                    </div>
                    <div className={style.leaveButtonContainer}>
                        <button className={style.leaveButton} onClick={handleLeaveRoom}>
                            채팅방 나가기
                        </button>
                    </div>
                </div>
                <div className={style.Room_right}>
                    <ChatRightBottom members={members} roomId={roomId} socket={socket} />
                </div>
            </div>
        </div>
    )
}

export default ChatRoom
