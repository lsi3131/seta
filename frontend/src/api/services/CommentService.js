import {axiosAuth} from "../GbobalInstance"

export const addLikeToPost = async (postId) => {
    const data = {

    }

    return await axiosAuth.post(`/api/posts/${postId}/`)
}

export const getPostById = async (postId) => {
    return await axiosAuth.get(`/api/posts/${postId}/`)
}
export const getCommentsByPostId = async (postId) => {
    return await axiosAuth.get(`/api/posts/${postId}/comments/`)
}