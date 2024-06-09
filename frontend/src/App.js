import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Cursor from './Components/Cursor/Cursor'
import NavBar from './Components/NavBar/NavBar'
import Board from './Components/Board/Board'
import Home from './Components/Home/Home'
import Login from './Components/Login/Login'
import BoardDetail from './Components/BoardDetail/BoardDetail'
import Write from './Components/Write/Write'
import Profile from './Components/Profile/Profile'
import Footer from './Components/Footer/Footer'
import { UserProvider } from 'userContext'
import ProfileUpdate from './Components/ProfileUpdate/ProfileUpdate'
import MyPosts from './Components/MyPosts/MyPosts'
import FabButton from './UI/FabButton/FabButton'
import MessageManage from 'Components/MessageManage/MessageManage'
import MessageDetail from 'Components/MessageDetail/MessageDetail'
import SearchResult from 'Components/Search/SearchResult'
import FindUser from 'Components/FindUser/FindUser'
import Chat from 'Components/Chat/Chat'
import ChatRoom from 'Components/ChattingRoom/ChattingRoom'
import GameRoom from "./Components/GameRoom/GameRoom";
import {GameWebSocketProvider} from "./Components/GameRoom/GameWebSocketProvider";
import {GameSettingProvider} from "./Components/GameRoom/GameSettingProvider";

function App() {
    return (
        <>
            <UserProvider>
                <Cursor />
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/board/:mbti" element={<Board />} />
                    <Route path="/detail/:detailId" element={<BoardDetail />} />
                    <Route path="/write" element={<Write />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/profile/update/:username" element={<ProfileUpdate />} />
                    <Route path="/update/:detailId" element={<Write />} />
                    <Route path="/myposts/:username" element={<MyPosts />} />
                    <Route path="/messages/" element={<MessageManage />} />
                    <Route path="/message/:messageId" element={<MessageDetail />} />
                    <Route path="/search" element={<SearchResult />} />
                    <Route path="/finduser" element={<FindUser />} />
                    <Route path="/chat" element={<Chat />} />

                    <Route path="/chatroom/:roomId" element={<ChatRoom />} />
                    <Route path="/gameroom/:roomId" element={<GameRoom />} />
                </Routes>
                <FabButton />
                <Footer />
            </UserProvider>
        </>
    )
}

export default App
