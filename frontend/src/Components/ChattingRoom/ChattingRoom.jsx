import React, {useState, useRef, useEffect} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import style from './ChattingRoom.module.css'
import ChatRightBottom from './ChatRightbottom'
import ChatRightTop from './ChatRightTop'
import apiClient from "../../services/apiClient";

const ChatRoom = () => {
    const location = useLocation();
    const {roomId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [password, setPaasword] = useState(
        location.state?.password || ''
    );

    useEffect(() => {
        const refreshList = async () => {
            async function fetchData() {
                try {
                    const data = {
                        id: roomId,
                        password: password,
                    }
                    console.log(data)
                    await apiClient.post(`api/chats/check_room_password/`, data)
                    setIsLoading(false)
                } catch (error) {
                    console.error('잘못된 경로로 채팅방에 입장했습니다.', error)
                    navigate('/chat')
                }
            }

            await fetchData()
        }
        refreshList()
    }, [password]);

    if (isLoading) {
        return <div>Loading...</div>
    }


    return (
        <div className={style.Room_vertical}>
            <div className={style.Room_container}>
                <div className={style.Room_left}></div>
                <div className={style.Room_right}>
                    <ChatRightTop/>
                    <ChatRightBottom roomId={roomId}/>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom
