// useApi.js
import {useState, useEffect} from 'react';
import apiClient from '../../services/apiClient'


const useBoardAPI = (mbti, initialFilter, initialOrder, initialPage) => {
    const [posts, setPosts] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [categories, setCategories] = useState([])
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [filter, setFilter] = useState(initialFilter);
    const [order, setOrder] = useState(initialOrder);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(mbti) {
            handleGetPostListPage(currentPage)
        }
    }, [mbti, currentPage, order, filter])

    useEffect(() => {
        handleGetCategory()
    }, []);

    const handleCategoryChanged = (type, data) => {
        if (type === 'filter') {
            setFilter(data)
            setCurrentPage(1)
        } else if (type === 'order') {
            setOrder(data)
            setCurrentPage(1)
        }
    }

    const handleGetCategory = () => {
        let url = `/api/posts/category/`
        apiClient
            .get(url)
            .then((response) => {
                setCategories(response.data)
            })
            .catch((error) => {
                console.error('Error during get posts:', error)
            })
    }


    const handleGetPostListPage = (page) => {
        let url = `/api/posts/mbti/${mbti}/?page=${page}`
        if (filter !== '') {
            url += `&category=${filter}`
        }
        if (order !== '') {
            url += `&order=${order}`
        }

        apiClient
            .get(url)
            .then((response) => {
                setLoading(false)
                setPosts(response.data['results'])
                setTotalPage(response.data['total_page'])
                setCurrentPage(page)
            })
            .catch((error) => {
                console.error('Error during get posts:', error)
                setError(error)
            })
    }


    return {isLoading, error, posts, categories, totalPage, currentPage, order, filter, handleCategoryChanged, handleGetPostListPage, setCurrentPage, setFilter};
};

export default useBoardAPI;
