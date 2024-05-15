import logo from './logo.svg'
import './App.css'
import {useState, useEffect} from 'react'
import Cursor from './Components/Cursor/Cursor'
import CommentBox from "./Components/Comment/Comment";
import NavBar from "./Components/NavBar/NavBar";

const mbti_list = [
    'INFP', 'ISFP', 'ENFP', 'ESFP'
]

function App() {
    return (
        <>
            <Cursor/>
            <NavBar/>
            <CommentBox/>
            {mbti_list.map((mbti) => (
                <>
                    <div>
                        <h1>helloworld-{mbti}</h1>
                    </div>
                </>
            ))}
        </>
    )
}

export default App
