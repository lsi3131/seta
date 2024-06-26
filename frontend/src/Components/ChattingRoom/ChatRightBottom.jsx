import React, { useState, useRef, useEffect, useContext } from 'react'
import style from './ChattingRoom.module.css'
import { UserContext } from '../../userContext'
import apiClient from '../../services/apiClient'

const ChatRightBottom = ({ members, socket, roomId }) => {
    const [text, setText] = useState('')
    const textareaRef = useRef(null)
    const [rows, setRows] = useState(1)
    const [messages, setMessages] = useState([])
    const [agomessages, setAgomessages] = useState([])
    const currentUser = useContext(UserContext)
    const messagesEndRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await apiClient.get(`/api/chats/${roomId}/message/`)
                setAgomessages(data)
                setIsLoading(false)
            } catch (err) {
                console.error(err)
                setIsLoading(false)
            }
        }
        fetchMessages()
    }, [roomId])

    useEffect(() => {
        if (!currentUser || !socket) return

        // WebSocket을 통해 메시지를 받는 부분
        const handleMessage = (event) => {
            const newMessage = JSON.parse(event.data)
            setMessages((prevMessages) => [...prevMessages, newMessage])
        }

        socket.addEventListener('message', handleMessage)

        // 컴포넌트 언마운트 시 WebSocket 이벤트 리스너 제거
        return () => {
            socket.removeEventListener('message', handleMessage)
        }
    }, [currentUser, socket])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
    }, [messages, agomessages])

    useEffect(() => {
        const adjustTextareaHeight = () => {
            const textarea = textareaRef.current
            if (textarea) {
                textarea.style.height = 'auto'
                textarea.style.height = `${textarea.scrollHeight}px`
            }
        }

        adjustTextareaHeight()
    }, [text])

    const handleTextChange = (e) => {
        const lines = e.target.value.split('\n').length
        if (lines > 15) {
            e.preventDefault()
            return
        }
        setText(e.target.value)
        setRows(lines)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) return // 빈 메시지 전송 방지

        // 현재 사용자가 방의 멤버가 아닌 경우 검사
        if (!members.includes(currentUser.username)) {
            if (window.confirm('이 채팅방의 멤버가 아닙니다. 채팅방 목록으로 돌아가시겠습니까?')) {
                window.location.href = '/chat' // 채팅방 목록으로 이동하는 URL을 여기에 입력하세요
            }
            return
        }

        const sendData = {
            message_type: 'message',
            message: text,
            username: currentUser.username,
        }

        socket.send(JSON.stringify(sendData))
        setText('')
        setRows(1)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }
    const formatMessageTime = (timeString) => {
        const date = new Date(timeString)
        return date.toLocaleTimeString('ko-KR')
    }

    return (
        <>
            <div className={style.Room_right_bottom}>
                <div className={style.Room_bottom_content} ref={messagesEndRef}>
                    {agomessages.map((agoMsg, index) => (
                        <div key={index} className={style.messages}>
                            <div
                                className={
                                    agoMsg.sender === currentUser.username ? style.my_message : style.other_message
                                }
                            >
                                <div>
                                    <span className={style.message_username}>{agoMsg.sender}</span>

                                    <span className={style.message_time}>{formatMessageTime(agoMsg.created_at)}</span>
                                </div>
                                <p>{agoMsg.content}</p>
                            </div>
                        </div>
                    ))}
                    {messages.map((msg, index) => (
                        <div key={index} className={style.messages}>
                            {msg.message_type === 'message' ? (
                                <div
                                    className={
                                        msg.username === currentUser.username ? style.my_message : style.other_message
                                    }
                                >
                                    <div>
                                        <span className={style.message_username}>{msg.username}</span>
                                        <span className={style.message_time}>
                                            {new Date().toLocaleTimeString('ko-KR')}
                                        </span>
                                    </div>
                                    <p>{msg.message}</p>
                                </div>
                            ) : (
                                <div
                                    className={
                                        msg.message_type === 'enter'
                                            ? style.enter_message
                                            : msg.message_type === 'leave'
                                            ? style.leave_message
                                            : msg.message_type === 'expel'
                                            ? style.expel_message
                                            : style.info_message
                                    }
                                >
                                    {msg.message}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={style.Room_bottom_submit}>
                <form action="#" className={style.Room_bottom_submit_form} onSubmit={handleSubmit}>
                    <textarea
                        ref={textareaRef}
                        className={style.Room_bottom_submit_textarea}
                        value={text}
                        onChange={handleTextChange}
                        onKeyPress={handleKeyPress}
                        placeholder="내용을 입력하세요"
                        rows={rows}
                    ></textarea>
                    <button className={style.Room_bottom_submit_button} type="submit">
                        &#10145;
                    </button>
                </form>
            </div>
        </>
    )
}

export default ChatRightBottom
