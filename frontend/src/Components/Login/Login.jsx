import React from 'react'
import * as Components from './Components'

function Login() {
    const [signIn, toggle] = React.useState(true)
    return (
        <Components.BodyContainer>
            <Components.Container>
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>회원가입</Components.Title>
                        <Components.Input type="text" placeholder="아이디" />
                        <Components.Input type="email" placeholder="이메일" />
                        <Components.Input type="password" placeholder="패스워드" />
                        <Components.Input type="password" placeholder="패스워드확인" />
                        <Components.Button>입력완료</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>로그인</Components.Title>
                        <Components.Input type="text" placeholder="아이디" />
                        <Components.Input type="password" placeholder="패스워드" />
                        <Components.Anchor href="#">패스워드찾기</Components.Anchor>
                        <Components.Button>로그인</Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>
                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title>처음오셨군요!</Components.Title>
                            <Components.ParaBox>
                                <Components.Paragraph>회원가입을 완료하시고</Components.Paragraph>
                                <Components.Paragraph>다양한 유형의 사람들과 소통해볼까요?</Components.Paragraph>
                            </Components.ParaBox>
                            <Components.GhostButton onClick={() => toggle(true)}>로그인</Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title>환영합니다!</Components.Title>
                            <Components.ParaBox>
                                <Components.Paragraph>이미 회원이신가요?</Components.Paragraph>
                                <Components.Paragraph>로그인해주세요!</Components.Paragraph>
                            </Components.ParaBox>
                            <Components.GhostButton onClick={() => toggle(false)}>회원가입</Components.GhostButton>
                        </Components.RightOverlayPanel>
                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
        </Components.BodyContainer>
    )
}

export default Login
