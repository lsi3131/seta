import styled from 'styled-components'
import { useState, useEffect } from 'react'
import apiClient from 'services/apiClient'

import useDebounce from './useDebounce'

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

const Success = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    color: green;
`

const PassContainer = () => {
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordCheck, setNewPasswordCheck] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const debouncedNewPassword = useDebounce(newPassword, 500)
    const debouncedNewPasswordCheck = useDebounce(newPasswordCheck, 500)

    useEffect(() => {
        if (debouncedNewPassword && debouncedNewPasswordCheck) {
            if (debouncedNewPassword !== debouncedNewPasswordCheck) {
                setError('새 비밀번호가 일치하지 않습니다.')
                setSuccess(null)
            } else {
                setError(null)
                setSuccess('기존의 비밀번호가 일치할 경우 자동로그아웃됩니다.')
            }
        }
    }, [newPasswordCheck, debouncedNewPasswordCheck])

    useEffect(() => {
        if (!debouncedNewPassword) {
            return
        }
        if (debouncedNewPassword === password) {
            setError('기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.')
            setSuccess(null)
            return
        }
        apiClient
            .post('/api/accounts/validate/password/', {
                data: newPassword,
            })
            .then((response) => {
                setSuccess(response.data.message)
                setError(null)
            })
            .catch((error) => {
                setError(error.response.data.error)
                setSuccess(null)
            })
    }, [debouncedNewPassword, newPassword])

    const handleChangePassword = async (e) => {
        e.preventDefault()
        try {
            setError(null)
            setSuccess(null)
            const response = await apiClient.put('/api/accounts/set/password/', {
                old_password: password,
                new_password: newPassword,
            })
            console.log(response.data.message)
            console.log(password, newPassword)
            setSuccess(response.data.message)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
        } catch (error) {
            setError(error.response.data.error)
            console.log(error.response.data)
        }
    }

    return (
        <Container>
            <HeaderSection>
                <IntroTitle>비밀번호 변경</IntroTitle>
            </HeaderSection>
            <BodySection>
                <InputWrapper>
                    <Input
                        type="password"
                        placeholder="현재 비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputWrapper>
                <InputWrapper>
                    <Input
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </InputWrapper>
                <InputWrapper>
                    <Input
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={newPasswordCheck}
                        onChange={(e) => setNewPasswordCheck(e.target.value)}
                    />
                </InputWrapper>
                <ButtonSection>
                    <Button onClick={handleChangePassword}>변경</Button>
                </ButtonSection>
                {error && <Error>{error}</Error>}
                {success && <Success>{success}</Success>}
            </BodySection>
        </Container>
    )
}

export default PassContainer
