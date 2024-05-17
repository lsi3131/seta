import style from "./Write.module.css";
import React, { useState } from "react";
import axios from "axios";


function getUrl(subUrl) {
    const urlRoot = 'http://127.0.0.1:8000'
    return `${urlRoot}${subUrl}`
}

const Write = () => {
    const accessToken = localStorage.getItem('accessToken');

    const [inputs, setInputs] = useState({
        title: "",
        content: "",
        category: "",
        mbti: []
    });

    const { title, content, category, mbti } = inputs;

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
        { id: 16, label: 'ENTJ', checked: false }
    ]);

    const handleCheckboxChange = (id) => {
        const updatedCheckboxes = mbti_checks.map(check =>
            check.id === id ? { ...check, checked: !check.checked } : check
        );
        setMbtiChecks(updatedCheckboxes);

        const updatedMbti = updatedCheckboxes.filter(check => check.checked).map(check => check.label);
        setInputs({
            ...inputs,
            mbti: updatedMbti
        });
    };

    const onChange = (e) => {
        const { value, id, type, name } = e.target;
        if (type === 'checkbox') {
            const updatedMbti = mbti.includes(value)
                ? mbti.filter(item => item !== value)
                : [...mbti, value];
            setInputs({
                ...inputs,
                mbti: updatedMbti
            });
        } else if (type === 'radio' && name === 'radios') {
            setInputs({
                ...inputs,
                category: value
            });
        } else {
            setInputs({
                ...inputs,
                [id]: value
            });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const url = getUrl(`/api/posts/mbti/${inputs.mbti}/`);

        console.log(inputs)
        console.log(url)

        try {
            const response = await axios.post(url, inputs, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            window.location.href = '/detail/:detailId'; //내가 작성한 게시물로 가야하는데
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={style.vertical}>
            <h1>글작성</h1>
            <form className={style.form }onSubmit={onSubmit}>
                <div className={style.radio}>
                    <label htmlFor="category1">질문있어요</label>
                    <input type="radio" id='category1' name="radios" value="질문있어요" checked={category === "질문있어요"} onChange={onChange} />
                    <label htmlFor="category2">유머</label>
                    <input type="radio" id='category2' name="radios" value="유머" checked={category === "유머"} onChange={onChange} />
                    <label htmlFor="category3">창작</label>
                    <input type="radio" id='category3' name="radios" value="창작" checked={category === "창작"} onChange={onChange} />
                </div>
            <hr />
                <div className={style.mbti}>
                    {mbti_checks.map(check => (
                        <div key={check.id}>
                            <label htmlFor={`check-${check.id}`}>{check.label}</label>
                            <input
                                type="checkbox"
                                id={`check-${check.id}`}
                                value={check.label}
                                checked={check.checked}
                                onChange={() => handleCheckboxChange(check.id)}
                            />
                        </div>
                    ))}
                </div>
                <label htmlFor="title">제목 :</label>
                <input type="text" id="title"
                placeholder="제목을 입력해 주세요"
                value={title} onChange={onChange} />
                <label htmlFor="content">내용 : </label>
                <textarea rows={4} id="content" placeholder="내용을 입력해 주세요" value={content} onChange={onChange} />
                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default Write;
