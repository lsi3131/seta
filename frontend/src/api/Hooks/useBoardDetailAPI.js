import {useState, useEffect} from 'react';
import apiClient from '../../services/apiClient'
import style from "../../Components/BoardDetail/BoardDetail.module.css";
import {useNavigate} from "react-router-dom";


const useBoardDetailAPI = (postId) => {
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState(null);
    const [commentCount, setCommentCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 로딩 상태 추가


    useEffect(() => {
        /* 게시판 정보와 조회수를 업데이트*/
        handleGetPost()
        handlePutHits()
    }, [postId])

    useEffect(() => {
        if (post) {
            /* 게시판 정보를 전부 읽어온 후 댓글 리스트를 읽어온다. */
            handleGetCommentList()
        }
    }, [post])

    /* Comment를 전부 읽어오면 로딩이 완료된다.*/
    useEffect(() => {
        if (comments) {
            setIsLoading(false) // 유효성 검사 후 로딩 상태 해제
        }
    }, [comments])

    const handlePutHits = async () => {
        try {
            await apiClient.put(`/api/posts/${postId}/hits/`)
        } catch (error) {
            console.error('Error during put hits:', error)
        }
    }

    const handleGetPost = async () => {
        try {
            const response = await apiClient.get(`/api/posts/${postId}/`)
            setPost(response.data)
        } catch (error) {
            console.error('Error during get post detail:', error)
            navigate('/')
        }
    }

    const handleSetLike = async (like_on) => {
        // if (!currentUser) {
        //     return
        // }

        const data = {
            like: like_on ? 1 : 0,
        }

        try {
            await apiClient.post(`/api/posts/${post.id}/likey/`, data)
            await handleGetPost()
        } catch (error) {
            console.error('Error during add like to post:', error)
        }
    }

    const handleGetCommentList = () => {
        apiClient.get(`/api/posts/${post.id}/comments/`)
            .then(response => {
                console.log('get comments successful:', response.data);
                setComments(response.data['results']);
                setCommentCount(response.data['count']);
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    };

    const handlePostComment = (content, parentId = null) => {
        let data = {
            content: content
        };
        if (parentId) {
            data.parent_comment_id = parentId;
        }
        apiClient.post(`/api/posts/${post.id}/comments/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handlePutComment = (commentId, content) => {
        const data = {
            content: content
        };
        apiClient.put(`/api/posts/${post.id}/comments/${commentId}/`, data)
            .then(response => {
                console.log('put comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during put comments:', error.response.data.error);
            })
    }

    const handleDeleteComment = (commentId) => {
        apiClient.delete(`/api/posts/${post.id}/comments/${commentId}/`)
            .then(response => {
                console.log('delete comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handleAddLikeComment = (commentId, isLikeOn) => {
        const data = {
            recommend: isLikeOn ? 1 : 0
        };

        apiClient.post(`/api/posts/${post.id}/comments/${commentId}/recommend/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentList();
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    return {
        isLoading,
        post,
        comments,
        commentCount,
        handleSetLike,
        handlePostComment,
        handlePutComment,
        handleDeleteComment,
        handleAddLikeComment
    };
};

export default useBoardDetailAPI;
