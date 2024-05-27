import style from './Write.module.css'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import apiClient from 'services/apiClient'
import { getFontColor } from '../../Utils/helpers'

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AWS from "aws-sdk";

const REGION = process.env.REACT_APP_AWS_S3_BUCKET_REGION;
const ACCESS_KEY = process.env.REACT_APP_AWS_S3_BUCKET_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_S3_BUCKET_SECRET_ACCESS_KEY;

const formats = [
    'font',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'align',
    'color',
    'background',
    'size',
    'h1',
    'image',
];
const Write = () => {
    const navigate = useNavigate()
    const [categorys, setCategorys] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [inputs, setInputs] = useState({
        title: '',
        content: '',
        category: '',
        mbti: [],
    })
    
    const quillRef = useRef(null);
    
    
    const imageHandler = async () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.addEventListener("change", async () => {
            //이미지를 담아 전송할 file을 만든다
            const file = input.files[0];
            const fileExt = file.name.split('.').pop();
            
            // 확장자 제한
            if (!['jpeg', 'png', 'jpg', 'JPG', 'PNG', 'JPEG'].includes(fileExt)) {
                alert('jpg, png, jpg 파일만 업로드가 가능합니다.');
                return;
            }
            try {
                //업로드할 파일의 이름으로 Date 사용
                const name = Date.now();
                const formData = new FormData();
                formData.append('image', file);
                formData.append('name', name);
                const result = await apiClient.post('/api/posts/image/', formData, {
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                })
            console.log(result)
            const url = "https://picturebucket9856.s3.amazonaws.com/media/"+file.name
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            editor.insertEmbed(range.index, "image", `${url}`);
            } catch (error) {
                console.log(error);
            }
    });
};
    
    const modules = useMemo(() => {
        return {
            toolbar: {
                container: 
                [   
                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ align: [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{color: [],},{ background: [] },],
                    ['image'],
                ],
                handlers: {
                    image: imageHandler,
                }
            },
        };
    }, []);


    const { title, content, category, mbti } = inputs
    const [error, setError] = useState('')
    const [values, setValues] = useState();

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
            try {
                const response = await apiClient.get('/api/posts/category/')
                console.log(response.data)
                setCategorys(response.data)
            } catch (error) {
                console.error('카테고리 데이터를 불러오는 중에 오류가 발생했습니다:', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (categorys.length > 0) {
            setIsLoading(false)
            console.log(categorys)
        }
    }, [categorys])

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
        } else if (id === 'title') {
            setInputs({
                ...inputs,
                title: value,
            });
        } 
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const postData = {...inputs, content: values === "<p><br></p>" ? "" : values}
        try {
            const response = await apiClient.post('/api/posts/create/', postData)
            const postId = response.data.id
            navigate(`/detail/${postId}/?mbti=${inputs.mbti[0]}`)
        } catch (error) {
            if (!inputs.category) {
                setError('카테고리를 선택해주세요')
            } else if (inputs.mbti.length === 0) {
                setError('게시될 MBTI 게시판을 선택해주세요')
            } else if (!inputs.title) {
                setError('제목을 입력해주세요')
            } else if (!values) {
                setError('내용을 입력해주세요')
            }
        }
    }

    if (isLoading) {
        return <div>loading...</div>
    }

    return (
        <div className={style.vertical}>
            <div className={style.board_top}>
                <h2>게시물 작성</h2>
            </div>
            <form className={style.form} onSubmit={onSubmit}>
                <div className={style.title}>
                    <div>
                        <select
                            name="category"
                            id="category"
                            value={inputs.category}
                            onChange={onChange}
                            className={style.select}
                        >
                            <option className={style.option} value="" disabled>
                                카테고리를 선택해주세요
                            </option>
                            {categorys &&
                                categorys.length > 0 &&
                                categorys.map((cate) => <option value={cate.name}>{cate.name}</option>)}
                        </select>
                        <input
                            type="text"
                            id="title"
                            placeholder="제목을 입력해 주세요"
                            value={title}
                            onChange={onChange}
                        />
                    </div>
                </div>

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
                                    className={style.checkboxInput}
                                />
                                <label
                                    htmlFor={`check-${check.id}`}
                                    className={`${style.badgeLabel} ${check.checked ? style.checked : ''}`}
                                    style={{ backgroundColor: check.checked ? getFontColor(check.label) : '#ccc' }}
                                >
                                    {check.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <ReactQuill
                    id="content"
                    theme="snow"
                    ref={quillRef}
                    modules={modules}
                    formats={formats}
                    value = {values}
                    onChange={setValues}
                    placeholder={'타인을 비방하거나 커뮤니티 이용정책에 맞지 않는 게시글은 예고없이 삭제될 수 있습니다.'}
                />
                

                <p></p>
                <p className={style.Error}>{error}</p>
                <button className={style.button} type="submit">
                    등록
                </button>
            </form>
        </div>
    )
}

export default Write
