import styled from 'styled-components'
import { useState } from 'react'
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
    font-size: 18px;
    color: rgba(60, 60, 60, 1);
    margin-bottom: 20px;
`

const BodySection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Textarea = styled.textarea`
    width: 100%;
    height: 200px;
    border: 1px solid #eeeeee;
    border-radius: 20px;
    padding: 20px;
    font-size: 16px;
`

const Counter = styled.div`
    align-self: flex-end;
    margin-top: 10px;
    font-size: 14px;
    color: ${(props) => (props.exceeded ? 'red' : 'inherit')};
`

const ButtonSection = styled.div`
    width: 100%;
    justify-content: center;
    margin-top: 20px;
    display: inline;
    align-items: center;
    text-align: center;
`

const Button = styled.button`
    padding: 15px 60px;
    font-size: 18px;
    font-weight: bold;
    background-color: rgba(0, 0, 255, 0.1);
    border: none;
    cursor: pointer;
    margin-top: 15px;
`

const IntroMessage = styled.div`
    font-size: 16px;
    color: ${(props) => (props.success ? 'green' : 'red')};
`

const IntroContainer = (props) => {
    const [introText, setIntroText] = useState(props.userInfos.introduce)
    const [introMessage, setIntroMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const maxLength = 200

    const handleTextChange = (event) => {
        const text = event.target.value
        if (text.length <= maxLength) {
            setIntroText(text)
        }
    }

    const handleSave = () => {
        apiClient
            .put(`/api/accounts/`, { introduce: introText })
            .then((response) => {
                setIntroMessage('저장되었습니다')
                setSuccess(true)
            })
            .catch((error) => {
                setIntroMessage('저장에 실패했습니다. 잠시후에 다시 시도해주세요.')
                setSuccess(false)
            })
    }

    return (
        <>
            <Container>
                <HeaderSection>
                    <IntroTitle>해당 소개글은 프로필 페이지에 반영됩니다</IntroTitle>
                </HeaderSection>
                <BodySection>
                    <Textarea
                        placeholder="자신을 간단하게 소개해보세요!"
                        value={introText}
                        onChange={handleTextChange}
                    />
                    <Counter exceeded={introText.length > maxLength}>
                        {introText.length}/{maxLength}
                    </Counter>
                </BodySection>

                <ButtonSection>
                    <IntroMessage success={success}>{introMessage}</IntroMessage>
                    <Button onClick={handleSave}>저장하기</Button>
                </ButtonSection>
            </Container>
        </>
    )
}

export default IntroContainer
