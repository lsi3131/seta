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
import Update from './Components/Update/Update'
import Footer from './Components/Footer/Footer'
import { UserProvider } from 'userContext'
import ProfileUpdate from './Components/ProfileUpdate/ProfileUpdate'
import ProfileMyPosts from './Components/Profile/ProfileMyPosts'
import FabButton from "./UI/FabButton/FabButton";

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
                    <Route path="/update/:detailId" element={<Update />} />
                    <Route path="/profile/:username/posts" element={< ProfileMyPosts/>} />
                </Routes>
                <FabButton/>
                <Footer />
            </UserProvider>
        </>
    )
}

export default App
