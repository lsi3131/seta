import React, {createContext, useState, useEffect} from 'react'
import {jwtDecode} from 'jwt-decode'

export const UserContext = createContext();
export const UpdateUserContext = createContext();

export const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        updateCurrentUser();
    }, [])

    const updateCurrentUser = () => {
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
            console.log('out', accessToken)
            setCurrentUser({
                username: '',
                mbti_type: '',
            })
        }
    }

    return (
        <UserContext.Provider value={currentUser}>
            <UpdateUserContext.Provider value={updateCurrentUser}>
                {children}
            </UpdateUserContext.Provider>
        </UserContext.Provider>
    );
}
