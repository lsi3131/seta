import React, { useState, useRef, useEffect } from "react";
import style from "./Chat.module.css";

const ChatRoom = () => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);
    const [rows, setRows] = useState(1)
 
    useEffect(() => {
        const adjustTextareaHeight = () => {
            const textarea = textareaRef.current;
            console.log(textarea)
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        adjustTextareaHeight();
    }, [text]);

    const handleTextChange = (e) => {
        const lines = e.target.value.split('\n').length;
        console.log(lines)
        if (lines > 15) {
            e.preventDefault(); 
            return;
        }
        setText(e.target.value);
        setRows(lines)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setText(""); 
        setRows(1)
    };

    return (
        <div className={style.Room_vertical}>
            <div className={style.Room_container}>
                <div className={style.Room_left}></div>
                <div className={style.Room_right}>
                    <div className={style.Room_right_top}></div>
                    <div className={style.Room_right_bottom}>
                        <div className={style.Room_content_box}></div>
                        <div className={style.Room_submit_box}>
                            <form action="#" className={style.Room_submit_form} onSubmit={handleSubmit}>
                                <textarea
                                    ref={textareaRef}
                                    className={style.Room_submit_textarea}
                                    value={text}
                                    onChange={handleTextChange}
                                    placeholder="내용을 입력하세요"
                                    rows={rows}
                                ></textarea>
                                <button className={style.Room_submit_button} type="submit">
                                    &#10145;
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
