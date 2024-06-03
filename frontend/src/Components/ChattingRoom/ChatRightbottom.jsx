import React, { useState, useRef, useEffect } from "react";
import style from "./ChattingRoom.module.css";

const ChatRightBottom = () => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);
    const [rows, setRows] = useState(1);
    const [submittedText, setSubmittedText] = useState("");

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
        setSubmittedText(text);
        setText("");
        setRows(1);
    };

    return (
        <div className={style.Room_right_bottom}>
            <div className={style.Room_bottom_content}>

            {submittedText}
            </div>
            <div className={style.Room_bottom_submit}>
                <form action="#" className={style.Room_bottom_submit_form} onSubmit={handleSubmit}>
                    <textarea
                        ref={textareaRef}
                        className={style.Room_bottom_submit_textarea}
                        value={text}
                        onChange={handleTextChange}
                        placeholder="내용을 입력하세요"
                        rows={rows}
                    ></textarea>
                    <button className={style.Room_bottom_submit_button} type="submit">
                        &#10145;
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRightBottom;
