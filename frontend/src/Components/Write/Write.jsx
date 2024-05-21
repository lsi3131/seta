import style from './Write.module.css'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import apiClient from 'services/apiClient'
import { getFontColor,getMainColor } from '../../Utils/helpers'


const Write = () => {
    const navigate = useNavigate();
    const [categorys, setCategorys] = useState('')
    const [inputs, setInputs] = useState({
        title: '',
        content: '',
        category: '',
        mbti: [],
    });

    const { title, content, category, mbti } = inputs
    const [Error, setError] = useState(' ')

    const [mbti_checks, setMbtiChecks] = useState([
        { id: 1, label: 'INTJ', checked: false },
        { id: 2, label: 'INTP', checked: false },
        { id: 3, label: 'ENTP', checked: false },
        { id: 4, label: 'ENTJ', checked: false },
        { id: 5, label: 'INFJ', checked: false },
        { id: 6, label: 'INFP', checked: false },
        { id: 7, label: 'ENFJ', checked: false },
        { id: 8, label: 'ENFP', checked: false },
        { id: 9, label: 'ISTJ', checked: false },
        { id: 10, label: 'ISFJ', checked: false },
        { id: 11, label: 'ESTJ', checked: false },
        { id: 12, label: 'ESFJ', checked: false },
        { id: 13, label: 'ISTP', checked: false },
        { id: 14, label: 'ISFP', checked: false },
        { id: 15, label: 'ESTP', checked: false },
        { id: 16, label: 'ESFP', checked: false },
    ])

    useEffect(() => {
        async function fetchData() {
            const response = await apiClient.get('/api/posts/create/')
            console.log(response.data)
            console.log(response.data.category)
            setCategorys(response.data)
        }
        fetchData();
    }, []);

//onChange와 합치기나 변경
    const handleCheckboxChange = (id) => {
        const updatedCheckboxes = mbti_checks.map((check) =>
            check.id === id ? { ...check, checked: !check.checked } : check,
        )
        setMbtiChecks(updatedCheckboxes)

        const updatedMbti = updatedCheckboxes.filter((check) => check.checked).map((check) => check.label)
        setInputs({
            ...inputs,
            mbti: updatedMbti,
        })
    }

    const onChange = (e) => {
        const { value, id, name } = e.target
        if (name === 'category' && id === 'category') {
            setInputs({
                ...inputs,
                category: value,
            })
        } else {
            setInputs({
                ...inputs,
                [id]: value,
            })
        }
    }


    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/api/posts/create/', inputs)
            const postId = response.data.id
            navigate(`detail/${postId}/`,);
        } catch (error) {
            if (!inputs.category) {
                setError('MBTI를 선택하세요')
            } else if (inputs.mbti.length === 0) {
                setError('제목을 입력하세요')
            } else if (!inputs.title) {
                setError('카테고리를 선택하세요')
            } else if (!inputs.content) {
                setError('내용을 입력하세요')
            }
        }
    };




    return (
        <div className={style.vertical}>
            <div className={style.board_top} >
                <h2>게시물 작성</h2>
            </div>
            <form className={style.form} onSubmit={onSubmit}>
                <hr />
                <div className={style.mbti}>
                    {mbti_checks.map((check) => (
                        <div key={check.id}>
                            <div className={style.mbtibox}>
                                <input
                                    type="checkbox"
                                    id={`check-${check.id}`}
                                    value={check.label}
                                    checked={check.checked}
                                    onChange={() => handleCheckboxChange(check.id)}
                                />
                                <label
                                    htmlFor={`check-${check.id}`}
                                    style={{ backgroundColor: getFontColor(check.label)}}
                                >
                                    {check.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <hr />
                <div className={style.title}>
                    <div>
                        <input type="text" id="title"
                            placeholder="제목을 입력해 주세요"
                            // required
                            value={title} onChange={onChange} />
                        <select name="category" id="category" value={inputs.category} onChange={onChange}
                        className={style.select}>
                            <option className={style.option} value="" selected disabled hidden> 카테고리를 선택해주세요</option>
                            {categorys && categorys.map((cate) =>
                                <option key={cate.id} value={cate.category}>{cate.category}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className={style.content}>
                    <div>
                        <textarea
                            id="content"
                            placeholder="뭐 욕설안돼 어쩌구 비방이 저쩌구 신고될수있으니 주의해 주세요"
                            value={content}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <p></p>
                <p className={style.Error}>{Error}</p>
                <button className={style.button} type="submit">등록</button>
            </form>
        </div>
    )
}

export default Write
