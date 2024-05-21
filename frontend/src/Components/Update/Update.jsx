import style from './Update.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import apiClient from 'services/apiClient'

const Update = () => {
    const { detailId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [inputs, setInputs] = useState({
        id: '',
        title: '',
        content: '',
        category: '',
        mbti: [],
    })
    const [Error, setError] = useState(' ')
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
    ])

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const response = await apiClient.get(`/api/posts/${detailId}/?purpose=update`)
                const post = response.data

                setInputs({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    category: post.category,
                    mbti: post.mbti,
                })
                setMbtiChecks((prevChecks) =>
                    prevChecks.map((check) => (post.mbti.includes(check.label) ? { ...check, checked: true } : check)),
                )
                setLoading(false)
            } catch (error) {
                navigate(`/detail/${detailId}`, { state: { mbti: 'ENFP' } })
            }
        }
        fetchPost()
    }, [])

    if (loading) {
        return <div>Loading...</div> // 로딩 상태를 표시
    }

    inputs.mbti.map((mbti) => {
        mbti_checks.map((check) => {
            if (mbti === check.label) {
                check.checked = true
            }
        })
    })

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
        const { value, id, type, name } = e.target
        if (type === 'radio' && name === 'radios') {
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
        try {
            const response = await apiClient.put(`/api/posts/${detailId}/`, inputs)
            navigate(`/detail/${detailId}`, { state: { mbti: 'ENFP' } })
            console.log('Server response:', response.data)
        } catch (error) {
            if (!inputs.category) {
                setError('카테고리를 선택하세요')
            } else if (inputs.mbti.length == 0) {
                setError('MBTI를 선택하세요')
            } else if (!inputs.title) {
                setError('제목을 입력하세요')
            } else if (!inputs.content) {
                setError('내용을 입력하세요')
            }
        }
    }

    return (
        <div className={style.vertical}>
            <div className={style.board_top}>
                <h1>글작성</h1>
            </div>
            <form className={style.form} onSubmit={onSubmit}>
                <div className={style.radio}>
                    <div>
                        <input
                            type="radio"
                            id="category1"
                            name="radios"
                            value="질문있어요"
                            checked={inputs.category === '질문있어요'}
                            onChange={onChange}
                        />
                        <label htmlFor="category1">질문있어요</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="category2"
                            name="radios"
                            value="유머"
                            checked={inputs.category === '유머'}
                            onChange={onChange}
                        />
                        <label htmlFor="category2">유머</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="category3"
                            name="radios"
                            value="창작"
                            checked={inputs.category === '창작'}
                            onChange={onChange}
                        />
                        <label htmlFor="category3">창작</label>
                    </div>
                </div>
                <hr />
                <div className={style.mbti}>
                    {mbti_checks.map((check) => (
                        <div key={check.id}>
                            <input
                                type="checkbox"
                                id={`check-${check.id}`}
                                value={check.label}
                                checked={check.checked}
                                onChange={() => handleCheckboxChange(check.id)}
                            />
                            <label htmlFor={`check-${check.id}`}>{check.label}</label>
                        </div>
                    ))}
                </div>
                <hr />
                <div className={style.title}>
                    <div>
                        <label htmlFor="title">제목</label>

                        <input
                            type="text"
                            id="title"
                            placeholder="제목을 입력해 주세요"
                            // required
                            value={inputs.title}
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className={style.content}>
                    <div>
                        <label htmlFor="content">내용</label>
                        <textarea
                            id="content"
                            placeholder="뭐 욕설안돼 어쩌구 비방이 저쩌구 신고될수있으니 주의해 주세요"
                            value={inputs.content}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <p></p>
                <p className={style.Error}>{Error}</p>
                <button className={style.button} type="submit">
                    등록
                </button>
            </form>
        </div>
    )
}

export default Update
