import React, { useState, useRef, useEffect, useContext } from 'react'
import style from './ChattingRoom.module.css'
import { UserContext } from '../../userContext'

const ChatRightBottom = ({ members, socket }) => {
    const [text, setText] = useState('')
    const textareaRef = useRef(null)
    const [rows, setRows] = useState(1)
    const [messages, setMessages] = useState([])
    const currentUser = useContext(UserContext)
    const messagesEndRef = useRef(null)

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
    }, [messages])

    useEffect(() => {
        const adjustTextareaHeight = () => {
            const textarea = textareaRef.current
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
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
            alert('이 채팅방의 멤버가 아닙니다. 다시 입장해주세요.')
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

    return (
        <>
            <div className={style.Room_right_bottom}>
                <div className={style.Room_bottom_content} ref={messagesEndRef}>
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
