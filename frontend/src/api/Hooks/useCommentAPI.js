import {useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'


const useCommentAPI = (commentPostId) => {
    const [comments, setComments] = useState(null);
    const [commentCount, setCommentCount] = useState(-1);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [error, setError] = useState(null); // 로딩 상태 추가


    useEffect(() => {
        if(commentPostId) {
            handleGetCommentListPage(currentPage)
        }
    }, [commentPostId])

    /* Comment를 전부 읽어오면 로딩이 완료된다.*/
    useEffect(() => {
        if (comments && commentCount !== -1) {
            setIsLoading(false) // 유효성 검사 후 로딩 상태 해제
        }
    }, [comments, commentCount])


    const handleGetCommentListPage = (page, newCommentId = null) => {
        apiClient.get(`/api/posts/${commentPostId}/comments/?page=${page}`)
            .then(response => {
                console.log('get comments successful:', response.data);
                setComments(response.data['results']);
                setCurrentPage(page)
                setTotalPage(response.data['total_page'])
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
        apiClient.post(`/api/posts/${commentPostId}/comments/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                //새로운 댓글 페이지로 이동
                const newPage = response.data['new_comment_page']
                handleGetCommentListPage(newPage);
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handlePutComment = (commentId, content) => {
        const data = {
            content: content
        };
        apiClient.put(`/api/posts/${commentPostId}/comments/${commentId}/`, data)
            .then(response => {
                console.log('put comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentListPage(currentPage);
            })
            .catch(error => {
                console.error('Error during put comments:', error.response.data.error);
            })
    }

    const handleDeleteComment = (commentId) => {
        apiClient.delete(`/api/posts/${commentPostId}/comments/${commentId}/`)
            .then(response => {
                console.log('delete comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentListPage(currentPage);
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    const handleAddLikeComment = (commentId, isLikeOn) => {
        const data = {
            recommend: isLikeOn ? 1 : 0
        };

        apiClient.post(`/api/posts/${commentPostId}/comments/${commentId}/recommend/`, data)
            .then(response => {
                console.log('post comments successful:', response.data);

                /* comment 정보 업데이트 */
                handleGetCommentListPage(currentPage);
            })
            .catch(error => {
                console.error('Error during add comments:', error.response.data.error);
            })
    }

    return {
        isLoading,
        comments,
        commentCount,
        currentPage,
        totalPage,
        handleGetCommentListPage,
        handlePostComment,
        handlePutComment,
        handleDeleteComment,
        handleAddLikeComment
    };
};

export default useCommentAPI;
