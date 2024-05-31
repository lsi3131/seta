import {useState, useEffect, useContext} from 'react';
import apiClient from '../../services/apiClient'
import {UserContext} from "../../userContext";
import {useNavigate} from "react-router-dom";


const useBoardCreateAPI = () => {
    const [error, setError] = useState(null);

    useEffect(() => {

    }, []);

    const postCreate = async (inputs, values) => {
        const postData = {...inputs, content: values === "<p><br></p>" ? "" : values}
        try {
            const response = await apiClient.post('/api/posts/create/', postData)
            const postId = response.data.id;

            return {
                postId: postId
            };
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
            throw error;
        }
    }

    const putCreate = async (inputs, values, postId) => {
        const postData = {...inputs, content: values === "<p><br></p>" ? "" : values}
        try {
            const response = await apiClient.put(`/api/posts/${postId}/`, postData)
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
            throw error;
        }
    }

    return {postCreate, putCreate, error}
}

export default useBoardCreateAPI;