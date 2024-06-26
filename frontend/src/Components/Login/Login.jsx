import React from 'react'
import { useEffect, useContext } from 'react'
import * as Components from './Components'
import apiClient from 'services/apiClient'
import useDebounce from './useDebounce'
import { useLocation, Link } from 'react-router-dom'
import SocialLoginButton from 'Components/SocialLogin/SocialsLogin'
import { UserContext } from '../../userContext'

function Login() {
    const FRONT_BASE_URL = process.env.REACT_APP_FRONT_URL

    const [signIn, toggle] = React.useState('true')
    const [usernameIn, setUsernameIn] = React.useState('')
    const [passwordIn, setPasswordIn] = React.useState('')
    const currentUser = useContext(UserContext)

    const [usernameUp, setUsernameUp] = React.useState('')
    const [passwordUp, setPasswordUp] = React.useState('')
    const [emailUp, setEmailUp] = React.useState('')
    const [passwordConfirmUp, setPasswordConfirmUp] = React.useState('')

    const debounceUsernameUp = useDebounce(usernameUp, 250)
    const debouncePasswordUp = useDebounce(passwordUp, 250)
    const debouncePasswordConfirmUp = useDebounce(passwordConfirmUp, 250)
    const debounceEmailUp = useDebounce(emailUp, 250)

    const [errorMessage, setErrorMessage] = React.useState('')
    const [usernameCheckMessage, setUsernameCheckMessage] = React.useState('')
    const [passwordCheckMessage, setPasswordCheckMessage] = React.useState('')
    const [emailCheckMessage, setEmailCheckMessage] = React.useState('')
    const [passwordConfirmCheckMessage, setPasswordConfirmCheckMessage] = React.useState('')

    const [modalOpen, setModalOpen] = React.useState(false)
    const [capslock, setCapslock] = React.useState(false)

    const [formValidateChecker, setFormValidateChecker] = React.useState({
        username: false,
        email: false,
        password: false,
        passwordCheck: false,
    })

    useEffect(() => {
        if (debounceUsernameUp === usernameUp) {
            checkUserName().then((r) => {})
        }
    }, [usernameUp, debounceUsernameUp])

    useEffect(() => {
        if (debouncePasswordUp === passwordUp) {
            checkPassword().then((r) => {})
        }
    }, [passwordUp, debouncePasswordUp])

    useEffect(() => {
        if (debouncePasswordConfirmUp === passwordConfirmUp) {
            checkPasswordCheck()
        }
    }, [passwordConfirmUp, debouncePasswordConfirmUp])

    useEffect(() => {
        if (debounceEmailUp === emailUp) {
            checkEmail().then((r) => {})
        }
    }, [emailUp, debounceEmailUp])

    const [isLogin, setIsLogin] = React.useState(false)

    useEffect(() => {
        if(passwordIn !== '' && capslock) {
            setErrorMessage('CapsLock이 켜져있습니다.')
        }else {
            setErrorMessage('')
        }
    }, [capslock, passwordIn])


    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await apiClient.post('/api/login/', {
                username: usernameIn,
                password: passwordIn,
            })
            const { access, refresh } = response.data
            localStorage.setItem('accessToken', access)
            localStorage.setItem('refreshToken', refresh)

            const redirectUrl = new URLSearchParams(window.location.search).get('redirectUrl')
            if (redirectUrl) {
                window.location.href = decodeURIComponent(redirectUrl)
            } else {
                window.location.href = '/'
            }
        } catch (error) {
            const message = error.response.data.detail
            setErrorMessage(message)
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            await checkUserName()
            await checkPassword()
            await checkPasswordCheck()
            await checkEmail()
        } catch (error) {}

        if (
            formValidateChecker.username === false ||
            formValidateChecker.password === false ||
            formValidateChecker.passwordCheck === false ||
            formValidateChecker.email === false
        ) {
            return
        }

        setModalOpen(true)

        apiClient
            .post('/api/accounts/', {
                username: usernameUp,
                email: emailUp,
                password: passwordUp,
                password_confirm: passwordConfirmUp,
            })
            .catch((error) => {})
    }

    async function checkUserName() {
        if (usernameUp === '') {
            setUsernameCheckMessage('')
            setFormValidateChecker((prevState) => ({
                ...prevState,
                username: false,
            }))
            return
        }
        const data = {
            data: usernameUp,
        }

        try {
            const response = await apiClient.post('/api/accounts/validate/username/', data)
            setUsernameCheckMessage(response.data.message)
            setFormValidateChecker((prevState) => ({
                ...prevState,
                username: true,
            }))
        } catch (error) {
            setUsernameCheckMessage(error.response.data.error)
            setFormValidateChecker((prevState) => ({
                ...prevState,
                username: false,
            }))
        }
    }

    async function checkPassword() {
        if (passwordUp === '') {
            setPasswordCheckMessage('')
            setFormValidateChecker((prevState) => ({
                ...prevState,
                password: false,
            }))
            return
        }

        const data = {
            data: passwordUp,
        }

        try {
            if (capslock) {
                setPasswordCheckMessage('CapsLock이 켜져있습니다.')
                setFormValidateChecker((prevState) => ({
                    ...prevState,
                    password: false,
                }))
                return
            }
            const response = await apiClient.post('/api/accounts/validate/password/', data)
            setPasswordCheckMessage(response.data.message)
            setFormValidateChecker((prevState) => ({
                ...prevState,
                password: true,
            }))
        } catch (error) {
            setPasswordCheckMessage(error.response.data.error)
            setFormValidateChecker((prevState) => ({
                ...prevState,
                password: false,
            }))
        }

        // 상태 업데이트가 완료된 후에 checkPasswordCheck를 호출합니다.
        checkPasswordCheck()
    }

    function checkPasswordCheck() {
        if (passwordConfirmUp === '') {
            setPasswordConfirmCheckMessage('')
            setFormValidateChecker((prevState) => ({
                ...prevState,
                passwordCheck: false,
            }))
            return
        }

        if (formValidateChecker.password === false) {
            if (capslock) {
                setPasswordConfirmCheckMessage('CapsLock이 켜져있습니다.')
            } else {
                setPasswordConfirmCheckMessage('비밀번호를 먼저 확인해주세요.')
                setFormValidateChecker((prevState) => ({
                    ...prevState,
                    passwordCheck: false,
                }))
            }
            return
        }

        if (passwordConfirmUp === passwordUp) {
            setPasswordConfirmCheckMessage('비밀번호가 일치합니다.')
            setFormValidateChecker((prevState) => ({
                ...prevState,
                passwordCheck: true,
            }))
        } else {
            setPasswordConfirmCheckMessage('비밀번호가 일치하지 않습니다.')
            setFormValidateChecker((prevState) => ({
                ...prevState,
                passwordCheck: false,
            }))
        }
    }

    async function checkEmail() {
        if (emailUp === '') {
            setEmailCheckMessage('')
            setFormValidateChecker((prevState) => ({
                ...prevState,
                email: false,
            }))
            return
        }

        const data = {
            data: emailUp,
        }

        try {
            const response = await apiClient.post('/api/accounts/validate/email/', data)
            setEmailCheckMessage(response.data.message)
            setFormValidateChecker((prevState) => ({
                ...prevState,
                email: true,
            }))
        } catch (error) {
            setEmailCheckMessage(error.response.data.error)
            setFormValidateChecker((prevState) => ({
                ...prevState,
                email: false,
            }))
        }
    }

    return (
        <div>
            <Components.BodyContainer>
                <Components.Container>
                    <Components.SignUpContainer signin={signIn}>
                        <Components.Form onSubmit={handleSignup}>
                            <Components.Title>회원가입</Components.Title>

                            <Components.Input
                                onChange={(e) => setUsernameUp(e.target.value)}
                                type="text"
                                placeholder="아이디"
                                value={usernameUp}
                            />
                            <Components.Span
                                className={formValidateChecker.username ? 'success-message' : 'error-message'}
                            >
                                {usernameCheckMessage}
                            </Components.Span>

                            <Components.Input
                                onChange={(e) => setEmailUp(e.target.value)}
                                type="email"
                                placeholder="이메일"
                                value={emailUp}
                            />
                            <Components.Span
                                className={formValidateChecker.email ? 'success-message' : 'error-message'}
                            >
                                {emailCheckMessage}
                            </Components.Span>

                            <Components.Input
                                onChange={(e) => setPasswordUp(e.target.value)}
                                type="password"
                                placeholder="패스워드"
                                onKeyUp={(e) => {
                                    if (e.getModifierState('CapsLock')) {
                                        setCapslock(true)
                                    } else {
                                        setCapslock(false)
                                    }
                                }}
                                value={passwordUp}
                            />
                            <Components.Span
                                className={formValidateChecker.password ? 'success-message' : 'error-message'}
                            >
                                {passwordCheckMessage}
                            </Components.Span>

                            <Components.Input
                                onChange={(e) => setPasswordConfirmUp(e.target.value)}
                                type="password"
                                placeholder="패스워드확인"
                                onKeyUp={(e) => {
                                    if (e.getModifierState('CapsLock')) {
                                        setCapslock(true)
                                    } else {
                                        setCapslock(false)
                                    }
                                }}
                                value={passwordConfirmUp}
                            />
                            <Components.Span
                                className={formValidateChecker.passwordCheck ? 'success-message' : 'error-message'}
                            >
                                {passwordConfirmCheckMessage}
                            </Components.Span>
                            <Components.Button>입력완료</Components.Button>
                        </Components.Form>
                    </Components.SignUpContainer>

                    <Components.SignInContainer signin={signIn}>
                        <Components.Form onSubmit={handleLogin}>
                            <Components.Title>로그인</Components.Title>
                            <Components.Input
                                onChange={(e) => setUsernameIn(e.target.value)}
                                type="text"
                                placeholder="아이디"
                                value={usernameIn}
                            />
                            <Components.Input
                                onChange={(e) => {
                                    setPasswordIn(e.target.value)
                                }}
                                onKeyUp={(e) => {
                                    if (e.getModifierState('CapsLock')) {
                                        setCapslock(true)
                                    } else {
                                        setCapslock(false)
                                    }
                                }}
                                type="password"
                                placeholder="패스워드"
                                value={passwordIn}
                            />
                            <Components.Span className="error-message">{errorMessage}</Components.Span>
                            <Components.Anchor href={`${FRONT_BASE_URL}/finduser/`}>
                                아아디/패스워드찾기
                            </Components.Anchor>
                            <Components.Button>로그인</Components.Button>
                        </Components.Form>
                        <SocialLoginButton />
                    </Components.SignInContainer>

                    <Components.OverlayContainer signin={signIn}>
                        <Components.Overlay signin={signIn}>
                            <Components.LeftOverlayPanel signin={signIn}>
                                <Components.Title>처음오셨군요!</Components.Title>
                                <Components.ParaBox>
                                    <Components.Paragraph>회원가입을 완료하시고</Components.Paragraph>
                                    <Components.Paragraph>다양한 유형의 사람들과 소통해볼까요?</Components.Paragraph>
                                </Components.ParaBox>
                                <Components.GhostButton
                                    onClick={() => {
                                        toggle('true')
                                        setUsernameUp('')
                                        setEmailUp('')
                                        setPasswordConfirmUp('')
                                        setPasswordUp('')
                                    }}
                                >
                                    로그인
                                </Components.GhostButton>
                            </Components.LeftOverlayPanel>

                            <Components.RightOverlayPanel signin={signIn}>
                                <Components.Title>환영합니다!</Components.Title>
                                <Components.ParaBox>
                                    <Components.Paragraph>이미 회원이신가요?</Components.Paragraph>
                                    <Components.Paragraph>로그인해주세요!</Components.Paragraph>
                                </Components.ParaBox>
                                <Components.GhostButton
                                    onClick={() => {
                                        toggle('false')
                                        setUsernameIn('')
                                        setPasswordIn('')
                                    }}
                                >
                                    회원가입
                                </Components.GhostButton>
                            </Components.RightOverlayPanel>
                        </Components.Overlay>
                    </Components.OverlayContainer>
                </Components.Container>
            </Components.BodyContainer>
            {modalOpen && (
                <Components.EmailModal>
                    <Components.ModalVertical>
                        <Components.ModalContent>
                            <Components.ModalH3>이메일 인증</Components.ModalH3>
                            <Components.ModalP>'{debounceEmailUp}' 로</Components.ModalP>
                            <Components.ModalP>인증메일을 보냈습니다.</Components.ModalP>
                            <Components.ModalP>이메일을 확인하세요.</Components.ModalP>
                            <Components.ModalButton>
                                <Link to="/">확인</Link>
                            </Components.ModalButton>
                        </Components.ModalContent>
                    </Components.ModalVertical>
                </Components.EmailModal>
            )}
        </div>
    )
}

export default Login
