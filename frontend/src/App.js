import logo from './logo.svg'
import './App.css'
import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import Cursor from './Components/Cursor/Cursor'
import CommentBox from "./Components/Comment/Comment";
import NavBar from "./Components/NavBar/NavBar";
import CardList from "./Components/Card/Card"
import Board from "./Components/Board/Board";


function App() {
    return (
        <>
            {/*<Cursor/>*/}
            <NavBar/>
            <CommentBox/>
            <Routes>
                <Route path="/" element={<CardList/>}/>
                <Route path="/board/:mbti" element={<Board/>}/>
            </Routes>
        </>
    )
}

export default App
