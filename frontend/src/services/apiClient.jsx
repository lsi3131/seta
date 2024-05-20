import axios from 'axios'

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 10000, // 요청 타임아웃
})

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401) {
            const refresh = localStorage.getItem('refreshToken')
            console.log(refresh)
            if (refresh) {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                        refresh: refresh,
                    })
                    const accessToken = response.data.access
                    const refreshToken = response.data.refresh
                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('refreshToken', refreshToken)

                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
                    return apiClient(originalRequest)
                } catch (refreshError) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    window.location.href = '/login'
                    return Promise.reject(refreshError)
                }
            } else {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    },
)

export default apiClient
