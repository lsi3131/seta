import style from "./Write.module.css";
import { Link,useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

function getUrl(subUrl) {
    const urlRoot = 'http://127.0.0.1:8000'
    return `${urlRoot}${subUrl}`
}

const Write = () => {
    const accessToken = localStorage.getItem('accessToken')
    const [radios, setRadios] = useState()
    const [inputs, setInputs] = useState({
        title: "",
        content: "",
        category: "",
        mbti_type: "",
    })
    const { title, content, category, mbti_type } = inputs

    const [mbti_checks, setMbtiChecks] = useState([
        { id: 1, label: 'ISTJ', checked: false },
        { id: 2, label: 'ISFJ', checked: false },
        { id: 3, label: 'INFJ', checked: false },
        { id: 4, label: 'INTJ', checked: false },
        { id: 5, label: 'ISTP', checked: false },
        { id: 6, label: 'ISFP', checked: false },
        { id: 7, label: 'INFP', checked: false },
        { id: 8, label: 'INTP', checked: false },
        { id: 9, label: 'ESTP', checked: false },
        { id: 10, label: 'ESFP', checked: false },
        { id: 11, label: 'ENFP', checked: false },
        { id: 12, label: 'ENTP', checked: false },
        { id: 13, label: 'ESTJ', checked: false },
        { id: 14, label: 'ESFJ', checked: false },
        { id: 15, label: 'ENFJ', checked: false },
        { id: 16, label: 'ENTJ', checked: false },
    ]);

    const handleRadioCheck = (e) => {
        setRadios(e.target.value);
        setInputs({
            ...inputs,
            category: e.target.value
        });
    }
    const handleCheckboxChange = (id) => {
        const updatedCheckboxes = mbti_checks.map(check =>
            check.id === id ? { ...check, checked: true } : { ...check, checked: false }
        );
        setMbtiChecks(updatedCheckboxes);
        const selectedType = updatedCheckboxes.find(check => check.checked);
        if (selectedType) {
            setInputs({
                ...inputs,
                mbti_type: selectedType.label
            });
        } else {
            setInputs({
                ...inputs,
                mbti_type: ""
            });
        }
    };

    const onChange = (e) => {
        const { value, id } = e.target;
        setInputs({
            ...inputs,
            [id]: value
        });
    };
 
    const onSubmit = async (e) => {
        e.preventDefault();
        const url = getUrl('/api/posts/mbti/${inputs.mbti_type}/')
        try{
            const response = await axios.post(url, inputs,{
                Authorization: `Bearer ${accessToken}`
            });
        } catch (error){
            console.error('Error:', error);
        }
    };


    return (
        <div className={style.vertical}>
            <h1>글작성</h1>
            <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="category1">질문 있어요</label>
                <input type="radio" id='category1' name="radios" value="질문있어요" checked={radios === "질문있어요"} onChange={handleRadioCheck} />
                <label htmlFor="category2">유머</label>
                <input type="radio" id='category2' name="radios" value="유머" checked={radios === "유머"} onChange={handleRadioCheck} />
                <label htmlFor="category3">창작</label>
                <input type="radio" id='category3' name="radios" value="창작" checked={radios === "창작"} onChange={handleRadioCheck} />
            </div>
            <div className="mbti_type">
                {mbti_checks.map(check => (
                    <div key={check.id}>
                        <label htmlFor={`check-${check.id}`}>{check.label}</label>
                        <input
                            type="checkbox"
                            id={`check-${check.id}`}
                            checked={check.checked}
                            onChange={() => handleCheckboxChange(check.id)}
                        />
                    </div>
                ))}
            </div>
            <input type="text" id='title' value={title} placeholder='제목을 입력하세요' onChange={onChange} />
            <textarea rows={4} id='content' value={content}  placeholder='내용을 입력하세요' onChange={onChange} />
            <button>등록</button>
            </form>
        </div>
    )
}

export default Write;