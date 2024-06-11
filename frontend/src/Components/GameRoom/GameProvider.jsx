import React, {createContext, useContext, useEffect, useState} from 'react';
import {UserContext} from "../../userContext";
import apiClient from "../../services/apiClient";
import {useNavigate} from "react-router-dom";

const wsBaseURL = process.env.REACT_APP_WS_BASE_URL;

const GameContext = createContext(null);

const GAME_STEP_LIST = ['wait_setting', 'wait_start', 'game_start']

export const GameProvider = ({children, roomId, initPassword}) => {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [password, setPassword] = useState(initPassword)
    const [socket, setSocket] = useState(null)
    const [members, setMembers] = useState([])
    const currentUser = useContext(UserContext)
    const [host, setHost] = useState('')


    const [gameSetting, setGameSetting] = useState({
        title: '',
        description: '',
    });
    const [showSettingModal, setShowSettingModal] = useState(false)
    const [gameStep, setGameStep] = useState(GAME_STEP_LIST[0])

    const [aiMessages, setAiMessages] = useState([])
    const [aiParty, setAiParty] = useState([])
    const [isAISubmit, setIsAISubmit] = useState(false)

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
        const url = `${wsBaseURL}/ws/game/${roomId}/`
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
            console.log('on message', event.data)
            const message = JSON.parse(event.data)
            if (message.message_type === 'enter' || message.message_type === 'leave') {
                setMembers(message.members)
                fetchHost()
            }

            if (
                message.message_type === 'ai_message_start' ||
                message.message_type === 'ai_message' ||
                message.message_type === 'ai_message_error'
            ) {
                console.log('ai', message)

                if (message.message_type === 'ai_message_start') {
                    setAiMessages([message])
                    setAiParty(message['message']['party'])
                    setIsAISubmit(false)
                    setGameStepGameStart()
                }
                else if (message.message_type === 'ai_message') {
                    setAiMessages((prevMessages) => [...prevMessages, message])
                    setAiParty(message['message']['party'])
                    setIsAISubmit(false)
                    setGameStepGameStart()
                } else if (message.message_type === 'ai_message_error') {
                    setIsAISubmit(false)
                }
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
                socket.close()
            }
        }
    }, [currentUser, roomId])

    const fetchHost = async () => {
        try {
            const response = await apiClient.get(`api/chats/${roomId}/`)
            setHost(response.data.host_user)
        } catch (error) {
            console.error('호스트 정보를 가져오는데 실패했습니다.', error)
        }
    }
    fetchHost()

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

    const setGameStepSetting = () => {
        setGameStep(GAME_STEP_LIST[0])
    }

    const setGameStepWaitStart = () => {
        setGameStep(GAME_STEP_LIST[1])
    }

    const setGameStepGameStart = () => {
        setGameStep(GAME_STEP_LIST[2])
    }

    const setAndSendGameSetting = (setting) => {
        setGameStep(GAME_STEP_LIST[1])
        setGameSetting(setting)
        sendSetting(setting)
    }

    const sendSetting = (setting) => {
        const sendData = {
            message_type: 'setting',
            title: setting['title'],
            instruction: setting['instruction'],
            member_count: members.length,
            message: '',
            username: currentUser.username,
        }
        socket.send(JSON.stringify(sendData))
    }

    const sendMessage = (text) => {
        const sendData = {
            message_type: 'message',
            message: text,
            username: currentUser.username,
        }

        if(text[0] === '!') {
            setIsAISubmit(true)
        }

        socket.send(JSON.stringify(sendData))
    }

    const startGame = () => {
        setGameStepGameStart();
        sendMessage('!게임시작')
    }

    return (
        <GameContext.Provider value={{
            isLoading,
            members,
            socket,
            host,
            showSettingModal,
            setShowSettingModal,
            gameSetting,
            gameStep,
            setGameStepSetting,
            setGameStepWaitStart,
            setGameStepGameStart,
            setAndSendGameSetting,
            startGame,
            sendMessage,
            aiMessages,
            aiParty,
            isAISubmit,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    return useContext(GameContext);
};
