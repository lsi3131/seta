import React, { useState, useRef, useEffect, useContext } from 'react'
import style from './ChattingRoom.module.css'
import { UserContext } from '../../userContext'

const ChatRightBottom = ({ roomId }) => {
    const [text, setText] = useState('')
    const textareaRef = useRef(null)
    const [rows, setRows] = useState(1)
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState(null)
    const currentUser = useContext(UserContext)
    const roomName = roomId

    useEffect(() => {
        if (!currentUser) return

        // WebSocket을 통해 메시지를 받는 부분
        const handleMessage = (event) => {
            const newMessage = JSON.parse(event.data)
            setMessages((prevMessages) => [...prevMessages, newMessage])
        }

        // WebSocket 연결
        const url = `ws://127.0.0.1:8000/ws/chat/${roomName}/`
        const socket = new WebSocket(url)

        socket.addEventListener('message', handleMessage)

        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    type: 'enter',
                    username: currentUser.username,
                    message: `${currentUser.username} 님이 입장하셨습니다.`,
                }),
            )
        }

        socket.onclose = () => {
            socket.send(
                JSON.stringify({
                    type: 'leave',
                    username: currentUser.username,
                    message: `${currentUser.username} 님이 퇴장하셨습니다.`,
                }),
            )
        }

        setSocket(socket)

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        type: 'leave',
                        username: currentUser.username,
                        message: `${currentUser.username} 님이 퇴장하셨습니다.`,
                    }),
                )
            }
            socket.close()
        }
    }, [currentUser, roomName])

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

        const sendData = {
            type: 'message',
            message: text,
            username: currentUser.username,
        }

        socket.send(JSON.stringify(sendData))
        setText('')
        setRows(1)
    }

    useEffect(() => {
        const handleWindowClose = (event) => {
            event.preventDefault()
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        type: 'leave',
                        username: currentUser.username,
                        message: `${currentUser.username} 님이 퇴장하셨습니다.`,
                    }),
                )
                socket.close()
            }
        }

        window.addEventListener('beforeunload', handleWindowClose)

        return () => {
            window.removeEventListener('beforeunload', handleWindowClose)
        }
    }, [socket, currentUser])

    return (
        <div className={style.Room_right_bottom}>
            <div className={style.Room_bottom_content}>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            {msg.username}: {msg.message}
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
                        placeholder="내용을 입력하세요"
                        rows={rows}
                    ></textarea>
                    <button className={style.Room_bottom_submit_button} type="submit">
                        &#10145;
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatRightBottom
