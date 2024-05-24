import styled from 'styled-components'
import { useState, useEffect } from 'react'
import apiClient from 'services/apiClient'

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 50px;
`

const HeaderSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
`

const IntroTitle = styled.div`
    font-size: 24px;
    color: rgba(60, 60, 60, 1);
    font-weight: 600;
`

const BodySection = styled.div`
    width: 100%;
    display: flex;

    flex-direction: column;
    align-items: center;
    margin-top: 30px;
`

const InputWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
`

const Input = styled.input`
    width: 100%;
    height: 40px;
    padding: 0 10px;
    border: 1px solid rgba(200, 200, 200, 1);
    border-radius: 5px;
    font-size: 16px;
`

const ButtonSection = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`

const Button = styled.button`
    width: 100%;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const Error = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    color: red;
`

const Description = styled.div`
    font-size: 16px;
    color: rgba(100, 100, 100, 1);
    margin-top: 10px;
`

const PassContainer = () => {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handlePassword = async (e) => {
        e.preventDefault()
        setError(null)

        if (!password) {
            setError('비밀번호를 입력해주세요')
            return
        }

        try {
            const response = await apiClient.delete('/api/accounts/', {
                data: { password: password },
            })
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            window.location.href = '/'
        } catch (err) {
            setError(err.response.data.error)
        }
    }

    return (
        <Container>
            <HeaderSection>
                <IntroTitle>계정탈퇴</IntroTitle>
                <Description>탈퇴를 원하신다면 패스워드를 입력해주세요</Description>
            </HeaderSection>
            <BodySection>
                <InputWrapper>
                    <Input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputWrapper>

                <ButtonSection>
                    <Button onClick={handlePassword}>탈퇴</Button>
                </ButtonSection>
                {error && <Error>{error}</Error>}
            </BodySection>
        </Container>
    )
}

export default PassContainer
