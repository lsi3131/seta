import {react, useEffect, useState} from 'react'
import style from './Chat.module.css'
import apiClient from '../../services/apiClient'
import {Link, useNavigate} from "react-router-dom";
import ChatRoomPasswordModal from "./ChatRoomPasswordModal";

const ChatList = ({posts}) => {
    const [showCheckPassword, setShowCheckPassword] = useState(false)
    const [roomId, setRoomId] = useState(0)
    const navigate = useNavigate()

    const handleLinkClick = (e, post) => {
        e.preventDefault();

        if (post['is_secret']) {
            // 비밀번호 인증 모달창 띄우기
            setRoomId(post.id)
            setShowCheckPassword(true)
        } else {
            // 채팅방으로 이동
            const password = ''
            navigate(`/chatroom/${post.id}`, {state: {password: password}})
        }
    };

    const handleEnterRoom = (roomId, password) => {
        navigate(`/chatroom/${roomId}`, {state: {password: password}})
    }

    const handleCloseRoom = () => {
        setShowCheckPassword(false)
    }

    return (
        <div className={style.chat_list}>
            {
                showCheckPassword && (
                    <ChatRoomPasswordModal onEnter={handleEnterRoom} onClose={handleCloseRoom} roomId={roomId}/>
                )
            }
            <table className={style.chat_table}>
                <thead>
                <tr>
                    <th>유형</th>
                    <th>방 제목</th>
                    <th>방장</th>
                    <th>인원</th>
                    <th>생성일시</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post) => (
                    <tr key={post.id}>
                        <td className={style.chat_list_title}>{post.room_category}</td>
                        <td className={style.chat_list_title}>
                            <Link to="" onClick={(e) => handleLinkClick(e, post)}>
                                {post.name.length > 20 ? post.name.slice(0, 20) + '...' : post.name}
                            </Link>
                            {post.is_secret ? <span className={style.secret}>🔒</span> : null}
                        </td>
                        <td className={style.chat_list_author}>{post.host_user}</td>
                        <td className={style.chat_list_author}>{post.members_count}</td>
                        <td className={style.chat_list_date}>{post.created_at}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ChatList
