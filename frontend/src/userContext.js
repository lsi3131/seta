import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            try {
                const decodedUser = jwtDecode(accessToken)
                setCurrentUser(decodedUser)
            } catch (error) {
                console.error('Invalid token:', error)
                setCurrentUser({
                    username: '',
                    mbti_type: '',
                })
            }
        } else {
            setCurrentUser({
                username: '',
                mbti_type: '',
            })
        }
    }, [])

    return <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
}
