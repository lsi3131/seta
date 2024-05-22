import { useState, useEffect, useContext } from 'react'
import * as Components from './Components'
import MbtiContainer from './MbtiContainer'
import apiClient from 'services/apiClient'
import { UserContext } from 'userContext'

const ProfileUpdate = () => {
    const currentUser = useContext(UserContext)
    const [choice, setChoice] = useState(1)
    const [userInfos, setUserInfos] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserInfos = async () => {
            try {
                setIsLoading(true)
                const response = await apiClient.get(`/api/accounts/${currentUser.username}/`)
                setUserInfos(response.data)
            } catch (error) {
                console.error('Error during fetch user infos:', error)
            }
        }
        fetchUserInfos()
    }, [currentUser, choice])

    useEffect(() => {
        if (userInfos) {
            setIsLoading(false)
        }
    }, [userInfos])

    if (isLoading) {
        return <Components.Loading>Loading...</Components.Loading>
    }

    return (
        <>
            <Components.BodyContainer>
                <Components.Containers>
                    <Components.Title>프로필 수정</Components.Title>
                    <Components.LeftMenuContainer>
                        <Components.MenuContainer
                            onClick={() => {
                                setChoice(1)
                            }}
                            isActive={choice === 1}
                        >
                            MBTI
                        </Components.MenuContainer>
                        <Components.MenuContainer
                            onClick={() => {
                                setChoice(2)
                            }}
                            isActive={choice === 2}
                        >
                            자기소개
                        </Components.MenuContainer>
                        <Components.MenuContainer
                            onClick={() => {
                                setChoice(3)
                            }}
                            isActive={choice === 3}
                        >
                            패스워드
                        </Components.MenuContainer>
                        <Components.MenuContainer
                            onClick={() => {
                                setChoice(4)
                            }}
                            isActive={choice === 4}
                        >
                            계정탈퇴
                        </Components.MenuContainer>
                    </Components.LeftMenuContainer>
                    <Components.RightContainer>
                        {choice === 1 && <MbtiContainer userInfos={userInfos}></MbtiContainer>}
                        {choice === 2 && <Components.IntroContainer>2</Components.IntroContainer>}
                        {choice === 3 && <Components.PassContainer>3</Components.PassContainer>}
                        {choice === 4 && <Components.SignoutContainer>4</Components.SignoutContainer>}
                    </Components.RightContainer>
                </Components.Containers>
            </Components.BodyContainer>
        </>
    )
}

export default ProfileUpdate
