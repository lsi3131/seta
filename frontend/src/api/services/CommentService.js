import apiClient from "../../services/apiClient"
export const addLikeToPost = async (postId, like_on) => {
    const accessToken = localStorage.getItem('accessToken')
    const headers = {
        Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
    }
    const data = {
        like: like_on
    }

    const url = `/api/posts/${postId}/likey/`
    return await apiClient.post(`/api/posts/${postId}/likey/`, data, {headers: headers})
}

export const getPostById = async (postId) => {
    return await apiClient.get(`/api/posts/${postId}/`)
}
export const getCommentsByPostId = async (postId) => {
    return await apiClient.get(`/api/posts/${postId}/comments/`)
}