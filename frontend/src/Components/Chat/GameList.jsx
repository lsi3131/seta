import { react, useEffect, useState } from 'react'
import style from './Chat.module.css'
import apiClient from '../../services/apiClient'
import { Link, useNavigate } from 'react-router-dom'
import ChatRoomPasswordModal from './ChatRoomPasswordModal'
import image from "../../Assets/images/game/trpg_setting.png";

const GameList = ({ posts }) => {
    const [showCheckPassword, setShowCheckPassword] = useState(false)
    const [roomId, setRoomId] = useState(0)
    const navigate = useNavigate()

    const handleLinkClick = (e, post) => {
        e.preventDefault()

        if (post.members_count >= post.max_members) {
            alert('채팅방 정원이 초과되었습니다.')
            return
        }

        if (post['is_secret']) {
            // 비밀번호 인증 모달창 띄우기
            setRoomId(post.id)
            setShowCheckPassword(true)
        } else {
            // 채팅방으로 이동
            const password = ''
            navigate(`/gameroom/${post.id}`, { state: { password: password } })
        }
    }

    const handleEnterRoom = (roomId, password) => {
        navigate(`/gameroom/${roomId}`, { state: { password: password } })
    }

    const handleCloseRoom = () => {
        setShowCheckPassword(false)
    }

    return (
        <div className={style.gameRoomImage}>
            <img src={image} alt=""></img>
            <h1>준비 중입니다... </h1>
        </div>
    )

    return (
        <div className={style.chat_list}>
            {showCheckPassword && (
                <ChatRoomPasswordModal onEnter={handleEnterRoom} onClose={handleCloseRoom} roomId={roomId} />
            )}
            <div className={style.chat_cards}>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={style.chat_card}
                        style={{ cursor: post.members_count >= post.max_members ? 'not-allowed' : '' }}
                        onClick={(e) => handleLinkClick(e, post)}
                    >
                        <h2 className={style.chat_card_title}>
                            <Link to="" >
                                {post.name.length > 20 ? post.name.slice(0, 20) + '...' : post.name}
                            </Link>
                            {post.is_secret ? <span className={style.secret}>🔒</span> : null}
                        </h2>
                        <p className={style.chat_card_author}>{post.host_user}</p>
                        <p
                            className={style.chat_card_member_count}
                            style={{ color: post.members_count >= post.max_members ? 'red' : 'black' }}
                        >
                            {post.members_count} / {post.max_members}
                        </p>
                        <p className={style.chat_card_date}>{post.created_at}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GameList
