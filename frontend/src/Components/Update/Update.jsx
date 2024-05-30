import style from './Update.module.css'
import {useParams, useNavigate} from 'react-router-dom'
import React, {useState, useEffect, useMemo, useRef, useContext} from 'react'
import apiClient from 'services/apiClient'
import {getFontColor} from 'Utils/helpers'
import ReactQuill, {Quill} from 'react-quill';
import ImageResize from 'quill-image-resize';
import {UserContext} from "../../userContext";
import ToggleSwitch from "../Write/ToggleSwtich";

Quill.register('modules/ImageResize', ImageResize);
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

const Update = () => {
    const currentUser = useContext(UserContext)
    const {detailId} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [categorys, setCategorys] = useState('')
    const [values, setValues] = useState('');
    const [inputs, setInputs] = useState({
        id: '',
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
                        'Content-Type': 'multipart/form-data'
                    }
                })
                console.log(result)
                const url = "https://picturebucket9856.s3.amazonaws.com/media/" + file.name
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", `${url}`);
                // 이미지 삽입 후 줄바꿈 삽입
                editor.setSelection(range.index + 1);
                editor.insertText(range.index + 1, '\n');

                // 커서를 새 줄로 이동
                editor.setSelection(range.index + 2, 0);
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
                        [{size: ['small', false, 'large', 'huge']}],
                        [{align: []}],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{list: 'ordered'}, {list: 'bullet'}],
                        [{color: [],}, {background: []},],
                        ['image'],
                    ],
                handlers: {
                    image: imageHandler,
                }
            },
            ImageResize: {
                parchment: Quill.import('parchment')
            }
        };
    }, []);


    const [Error, setError] = useState(' ')

    const [mbtiChecks, setMbtiChecks] = useState([
        {id: 1, label: 'INTJ', checked: false},
        {id: 2, label: 'INTP', checked: false},
        {id: 3, label: 'ENTP', checked: false},
        {id: 4, label: 'ENTJ', checked: false},
        {id: 5, label: 'INFJ', checked: false},
        {id: 6, label: 'INFP', checked: false},
        {id: 7, label: 'ENFJ', checked: false},
        {id: 8, label: 'ENFP', checked: false},
        {id: 9, label: 'ISTJ', checked: false},
        {id: 10, label: 'ISFJ', checked: false},
        {id: 11, label: 'ESTJ', checked: false},
        {id: 12, label: 'ESFJ', checked: false},
        {id: 13, label: 'ISTP', checked: false},
        {id: 14, label: 'ISFP', checked: false},
        {id: 15, label: 'ESTP', checked: false},
        {id: 16, label: 'ESFP', checked: false},
    ])

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const response = await apiClient.get(`/api/posts/${detailId}/?purpose=update`)
                const post = response.data

                const cateResponse = await apiClient.get('/api/posts/category/')
                setCategorys(cateResponse.data)

                setInputs({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    category: post.category,
                    mbti: post.mbti,
                })
                setValues(post.content);
                setMbtiChecks((prevChecks) =>
                    prevChecks.map((check) =>
                        post.mbti.some((mbti) => mbti.toLowerCase() === check.label.toLowerCase())
                            ? {...check, checked: true}
                            : check
                    )
                );
                setLoading(false)
            } catch (error) {
                navigate(-1)
            }
        }

        fetchPost()
    }, [])

    useEffect(() => {
    }, [mbtiChecks]);

    const handleCheckAll = (isCheck) => {
        const updatedChecks = mbtiChecks.map(item => ({...item, checked: isCheck}))
        setMbtiChecks(updatedChecks);
        const updatedMbti = updatedChecks.filter((check) => check.checked).map((check) => check.label)
        setInputs({
            ...inputs,
            mbti: updatedMbti,
        })
    }

    if (loading) {
        return <div>Loading...</div> // 로딩 상태를 표시
    }

    inputs.mbti.map((mbti) => {
        mbtiChecks.map((check) => {
            if (mbti === check.label) {
                check.checked = true
            }
        })
    })


    const handleCheckboxChange = (id) => {
        const updatedCheckboxes = mbtiChecks.map((check) =>
            check.id === id ? {...check, checked: !check.checked} : check,
        )
        setMbtiChecks(updatedCheckboxes)

        const updatedMbti = updatedCheckboxes.filter((check) => check.checked).map((check) => check.label)
        setInputs({
            ...inputs,
            mbti: updatedMbti,
        })
    }

    const onChange = (e) => {
        const {value, id, name} = e.target
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
        e.preventDefault()
        const postData = {...inputs, content: values === "<p><br></p>" ? "" : values}
        try {
            const url = `/api/posts/${detailId}/`
            console.log(url)
            const response = await apiClient.put(`/api/posts/${detailId}/`, postData)
            navigate(`/detail/${detailId}/?mbti=${currentUser.mbti_type}&boardMbti=${inputs.mbti[0]}`)
            console.log('Server response:', response.data)
        } catch (error) {
            if (!inputs.category) {
                setError('카테고리를 선택하세요')
            } else if (inputs.mbti.length == 0) {
                setError('MBTI를 선택하세요')
            } else if (!inputs.title) {
                setError('제목을 입력하세요')
            } else if (!values) {
                setError('내용을 입력하세요')
            }
        }
    }

    return (
        <div className={style.vertical}>
            <div className={style.board_top}>
                <h2>게시물 수정</h2>
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
                            {categorys && categorys.map((cate) => <option value={cate.name}>{cate.name}</option>)}
                        </select>
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

                <div className={style.mbti_checkbox}>
                    <div className={style.mbti}>
                        {mbtiChecks.map((check) => (
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
                                        style={{backgroundColor: check.checked ? getFontColor(check.label) : '#ccc'}}
                                    >
                                        {check.label}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={style.toggleSwitchContainer}>
                        <h3>전체 선택</h3>
                        <ToggleSwitch mbti_checks={mbtiChecks} onSelectAll={handleCheckAll}/>
                    </div>
                </div>

                <ReactQuill
                    id="content"
                    theme="snow"
                    ref={quillRef}
                    style={{height: '600px'}}
                    modules={modules}
                    formats={formats}
                    value={values}
                    onChange={setValues}
                    placeholder={'타인을 비방하거나 커뮤니티 이용정책에 맞지 않는 게시글은 예고없이 삭제될 수 있습니다.'}
                />

                <p></p>
                <p className={style.Error}>{Error}</p>
                <button className={style.button} type="submit">
                    수정 완료
                </button>
            </form>
        </div>
    )
}

export default Update
