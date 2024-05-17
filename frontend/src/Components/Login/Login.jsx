import React from 'react'
import { useEffect } from 'react'
import * as Components from './Components'
import axios from 'axios'
import useDebounce from './useDebounce'

function Login() {
    const [signIn, toggle] = React.useState('true')
    const [usernameIn, setUsernameIn] = React.useState('')
    const [passwordIn, setPasswordIn] = React.useState('')

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

    function getUrl(subUrl) {
        const urlRoot = 'http://127.0.0.1:8000'
        return `${urlRoot}${subUrl}`
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(getUrl('/api/login'), {
                username: usernameIn,
                password: passwordIn,
            })
            const { access, refresh } = response.data
            localStorage.setItem('accessToken', access)
            localStorage.setItem('refreshToken', refresh)
            window.location.href = '/' // 혹은 메인 화면으로
        } catch (error) {
            const message = '아이디 또는 비밀번호를 잘못 입력했습니다.'
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
            formValidateChecker.username === 'false' ||
            formValidateChecker.password === 'false' ||
            formValidateChecker.passwordCheck === 'false' ||
            formValidateChecker.email === 'false'
        ) {
            return
        }

        axios
            .post(getUrl('/api/accounts/'), {
                username: usernameUp,
                email: emailUp,
                password: passwordUp,
                password_confirm: passwordConfirmUp,
            })
            .then((response) => {
                alert(response.status)
                if (response.status === 201) {
                    window.location.href = '/login'
                }
            })
            .catch((error) => {})
    }
    async function checkUserName() {
        if (usernameUp === '') {
            setUsernameCheckMessage('')
            return
        }
        const data = {
            data: usernameUp,
        }

        const url = getUrl('/api/accounts/validate/username/')
        try {
            const response = await axios.post(url, data)
            setUsernameCheckMessage(response.data.message)
            setFormValidateChecker({
                ...formValidateChecker,
                username: true,
            })
        } catch (error) {
            setUsernameCheckMessage(error.response.data.error)
            setFormValidateChecker({
                ...formValidateChecker,
                username: false,
            })
        }
    }

    async function checkPassword() {
        if (passwordUp === '') {
            setPasswordCheckMessage('')
            setFormValidateChecker({
                ...formValidateChecker,
                password: false,
            })
            return
        }

        const data = {
            data: passwordUp,
        }

        const url = getUrl('/api/accounts/validate/password/')
        try {
            const response = await axios.post(url, data)
            setFormValidateChecker({
                ...formValidateChecker,
                password: true,
            })
            setPasswordCheckMessage(response.data.message)
        } catch (error) {
            setPasswordCheckMessage(error.response.data.error)
            setFormValidateChecker({
                ...formValidateChecker,
                password: false,
            })
        }

        checkPasswordCheck()
    }

    function checkPasswordCheck() {
        if (passwordConfirmUp === '') {
            setPasswordConfirmCheckMessage('')
            return
        }

        if (formValidateChecker.password === false) {
            setPasswordConfirmCheckMessage('비밀번호를 먼저 확인해주세요.')
            setFormValidateChecker({
                ...formValidateChecker,
                passwordCheck: false,
            })
            return
        }

        if (passwordConfirmUp === passwordUp) {
            setPasswordConfirmCheckMessage('비밀번호가 일치합니다.')
            setFormValidateChecker({
                ...formValidateChecker,
                passwordCheck: true,
            })
        } else {
            setPasswordConfirmCheckMessage('비밀번호가 일치하지 않습니다.')
            setFormValidateChecker({
                ...formValidateChecker,
                passwordCheck: false,
            })
        }
    }

    async function checkEmail() {
        if (emailUp === '') {
            setEmailCheckMessage('')
            return
        }

        const data = {
            data: emailUp,
        }

        const url = getUrl('/api/accounts/validate/email/')
        try {
            const response = await axios.post(url, data)
            setEmailCheckMessage(response.data.message)
            setFormValidateChecker({
                ...formValidateChecker,
                email: true,
            })
        } catch (error) {
            setEmailCheckMessage(error.response.data.error)
            setFormValidateChecker({
                ...formValidateChecker,
                email: false,
            })
        }
    }

    return (
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
                        <Components.Span className={formValidateChecker.username ? 'success-message' : 'error-message'}>
                            {usernameCheckMessage}
                        </Components.Span>

                        <Components.Input
                            onChange={(e) => setEmailUp(e.target.value)}
                            type="email"
                            placeholder="이메일"
                            value={emailUp}
                        />
                        <Components.Span className={formValidateChecker.email ? 'success-message' : 'error-message'}>
                            {emailCheckMessage}
                        </Components.Span>

                        <Components.Input
                            onChange={(e) => setPasswordUp(e.target.value)}
                            type="password"
                            placeholder="패스워드"
                            value={passwordUp}
                        />
                        <Components.Span className={formValidateChecker.password ? 'success-message' : 'error-message'}>
                            {passwordCheckMessage}
                        </Components.Span>

                        <Components.Input
                            onChange={(e) => setPasswordConfirmUp(e.target.value)}
                            type="password"
                            placeholder="패스워드확인"
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
                            onChange={(e) => setPasswordIn(e.target.value)}
                            type="password"
                            placeholder="패스워드"
                            value={passwordIn}
                        />
                        <Components.Span className="error-message">{errorMessage}</Components.Span>
                        <Components.Anchor href="#">패스워드찾기</Components.Anchor>
                        <Components.Button>로그인</Components.Button>
                    </Components.Form>
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
    )
}

export default Login
