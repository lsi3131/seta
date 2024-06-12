import React, { react, useEffect, useState, useContext } from 'react'
import style from './Chat.module.css'
import apiClient from '../../services/apiClient'
import { Link, useNavigate } from 'react-router-dom'
import ChatRoomPasswordModal from './ChatRoomPasswordModal'
import { UserContext } from '../../userContext'
import Pagination from "../Pagenation/Pagination";

const ChatList = ({ posts, onChatClick }) => {
    const currentUser = useContext(UserContext)

    return (
        <div className={style.chat_list}>
            <div className={style.chat_cards}>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={style.chat_card}
                        style={{ cursor: post.members_count >= post.max_members ? 'not-allowed' : '' }}
                        onClick={(e) => {!currentUser.username ? window.location.href = '/login' : onChatClick(e, post)}}
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

export default ChatList
