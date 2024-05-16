import logo from './logo.svg'
import './App.css'
import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import Cursor from './Components/Cursor/Cursor'
import NavBar from "./Components/NavBar/NavBar";
import Board from "./Components/Board/Board";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import BoardDetail from "./Components/BoardDetail/BoardDetail";
import Write from "./Components/Write/Write";
import Profile from "./Components/Profile/Profile";


function App() {
    return (
        <>
            <Cursor/>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/board/:mbti" element={<Board/>}/>
                <Route path="/board_detail/:detailId" element={<BoardDetail />}/>
                <Route path="/write" element={<Write />}/>
                <Route path="/profile/:username" element={<Profile />}/>
            </Routes>
        </>
    )
}

export default App
