import {useState, useEffect} from 'react';
import apiClient from '../../services/apiClient'


const useCategoryAPI = () => {
    const [categorys, setCategorys] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiClient.get('/api/posts/category/')
                console.log(response.data)
                setCategorys(response.data)
                setLoading(false)
            } catch (error) {
                console.error('카테고리 데이터를 불러오는 중에 오류가 발생했습니다:', error)
            }
        }

        fetchData()
    }, []);

    return {categorys, isLoading}
}

export default useCategoryAPI;