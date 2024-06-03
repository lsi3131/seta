import style from './Chat.module.css'
import {Link} from "react-router-dom";

const ChatList = ({posts, onChatClick}) => {
    return (
        <div className={style.chat_list}>
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
                            <Link to="" onClick={(e) => onChatClick(e, post)}>
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
