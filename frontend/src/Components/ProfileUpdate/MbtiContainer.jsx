import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import apiClient from 'services/apiClient'
import { UpdateUserContext, UserContext } from '../../userContext'

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 50px;
`

const MbtiDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
`

const SliderWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`

const LabelWrapper = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    font-weight: bold;
`

const LeftDiv = styled.div``

const RightDiv = styled.div``

const MbtiRange = styled.input`
    width: 100%;
    height: 20px; /* 원하는 세로폭으로 설정 */
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: ${(props) => `linear-gradient(to right, blue ${props.value}%, red ${props.value}%)`};

    /* 트랙 스타일 */
    &::-webkit-slider-runnable-track {
        height: 18px; /* 세로폭을 맞추기 위해 설정 */
        background: transparent; /* 배경을 투명으로 설정 */
    }

    &::-moz-range-track {
        height: 18px; /* 세로폭을 맞추기 위해 설정 */
        background: transparent; /* 배경을 투명으로 설정 */
    }

    /* 핸들 스타일 */
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 30px; /* 핸들 크기 설정 */
        height: 50px; /* 핸들 크기 설정 */
        background: #666;
        cursor: pointer;
    }

    &::-moz-range-thumb {
        width: 30px; /* 핸들 크기 설정 */
        height: 50px; /* 핸들 크기 설정 */
        background: #666;
        cursor: pointer;
    }
`

const PercentageDisplay = styled.div`
    margin: 0 10px;
    font-size: 16px;
`

const UserMbti = styled.div`
    margin-top: 50px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
`

const MbtiResult = styled.div`
    margin: 0 10px;
    font-size: 40px;
    font-weight: bold;
    height: 80px;
    width: 80px;
    background-color: ${(props) => (props.partcheck === '-' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)')};
    align-items: center;
    display: flex;
    justify-content: center;
    border-radius: 50%;
`

const MbtiUpdate = styled.div`
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
`

const UpdateButton = styled.button`
    width: 100%;
    height: 40px;

    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 5px;

    background-color: ${(props) => (props.mbticheck ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)')};
    color: ${(props) => (props.mbticheck ? 'white' : 'black')};
    disabled: ${(props) => (props.mbticheck ? 'false' : 'true')};
    cursor: ${(props) => (props.mbticheck ? 'pointer' : 'not-allowed')};
`

const MbtiMessage = styled.div`
    font-size: 15px;
    color: ${(props) => (props.mbticheck ? 'green' : 'red')};
    margin-bottom: 20px;
`

const MbtiContainer = (props) => {
    const [iePercentage, setIePercentage] = useState(50)
    const [nsPercentage, setNsPercentage] = useState(50)
    const [tfPercentage, setTfPercentage] = useState(50)
    const [pjPercentage, setPjPercentage] = useState(50)
    const [mbtiCheck, setMbtiCheck] = useState(true)
    const [userMbti, setUserMbti] = useState({})
    const [mbtiMessage, setMbtiMessage] = useState('')
    const updateCurrentUser = useContext(UpdateUserContext)
    const currentUser = useContext(UserContext)

    const handleUpdate = () => {
        if (!mbtiCheck) {
            return
        }

        const mbti = userMbti.ie + userMbti.ns + userMbti.tf + userMbti.pj
        apiClient
            .put(`/api/accounts/set/mbti/`, {
                mbti_type: mbti,
                percentIE: iePercentage,
                percentNS: nsPercentage,
                percentFT: tfPercentage,
                percentPJ: pjPercentage,
            })
            .then((response) => {
                console.log('success to update response', response)
                const access = response.data.accessToken
                const refresh = response.data.refreshToken
                localStorage.setItem('accessToken', access)
                localStorage.setItem('refreshToken', refresh)

                updateCurrentUser()
                setMbtiMessage('MBTI 가 수정되었습니다!')
            })
            .catch((error) => {
                console.error('fail to update mbti', error)
            })
    }

    useEffect(() => {
        const infos = props.userInfos
        if (infos.mbti) {
            setIePercentage(infos.percentIE)
            setNsPercentage(infos.percentNS)
            setTfPercentage(infos.percentFT)
            setPjPercentage(infos.percentPJ)

            setUserMbti({
                ie: infos.mbti[0].toUpperCase(),
                ns: infos.mbti[1].toUpperCase(),
                tf: infos.mbti[2].toUpperCase(),
                pj: infos.mbti[3].toUpperCase(),
            })
        } else {
            setIePercentage(50)
            setNsPercentage(50)
            setTfPercentage(50)
            setPjPercentage(50)
            setUserMbti({
                ie: '-',
                ns: '-',
                tf: '-',
                pj: '-',
            })
        }
    }, [props.userInfos])

    useEffect(() => {
        if (currentUser && currentUser.mbti_type) {
            setMbtiCheck(false)
            setMbtiMessage('MBTI가 이미 설정되어있습니다.')
        } else if (userMbti.ie === '-' || userMbti.ns === '-' || userMbti.tf === '-' || userMbti.pj === '-') {
            setMbtiCheck(false)
            setMbtiMessage('MBTI 는 중간값으로 설정할 수 없습니다!')
        } else {
            setMbtiCheck(true)
            setMbtiMessage('')
        }
    }, [userMbti])

    const handleIeChange = (event) => {
        const per = event.target.value
        setIePercentage(per)
        setUserMbti({ ...userMbti, ie: per > 50 ? 'E' : per == 50 ? '-' : 'I' })
    }

    const handleNsChange = (event) => {
        const per = event.target.value
        setNsPercentage(per)
        setUserMbti({ ...userMbti, ns: per > 50 ? 'N' : per == 50 ? '-' : 'S' })
    }

    const handleTfChange = (event) => {
        const per = event.target.value
        setTfPercentage(per)
        setUserMbti({ ...userMbti, tf: per > 50 ? 'T' : per == 50 ? '-' : 'F' })
    }

    const handlePjChange = (event) => {
        const per = event.target.value
        setPjPercentage(per)
        setUserMbti({ ...userMbti, pj: per > 50 ? 'J' : per == 50 ? '-' : 'P' })
    }

    return (
        <Container>
            <MbtiDiv>
                <LabelWrapper>
                    <LeftDiv>E</LeftDiv>
                    <RightDiv>I</RightDiv>
                </LabelWrapper>
                <SliderWrapper>
                    <PercentageDisplay>{iePercentage}%</PercentageDisplay>
                    <MbtiRange type="range" min="0" max="100" step="5" value={iePercentage} onChange={handleIeChange} />
                    <PercentageDisplay>{100 - iePercentage}%</PercentageDisplay>
                </SliderWrapper>
            </MbtiDiv>
            <MbtiDiv>
                <LabelWrapper>
                    <LeftDiv>N</LeftDiv>
                    <RightDiv>S</RightDiv>
                </LabelWrapper>
                <SliderWrapper>
                    <PercentageDisplay>{nsPercentage}%</PercentageDisplay>
                    <MbtiRange type="range" min="0" max="100" step="5" value={nsPercentage} onChange={handleNsChange} />
                    <PercentageDisplay>{100 - nsPercentage}%</PercentageDisplay>
                </SliderWrapper>
            </MbtiDiv>
            <MbtiDiv>
                <LabelWrapper>
                    <LeftDiv>T</LeftDiv>
                    <RightDiv>F</RightDiv>
                </LabelWrapper>
                <SliderWrapper>
                    <PercentageDisplay>{tfPercentage}%</PercentageDisplay>
                    <MbtiRange type="range" min="0" max="100" step="5" value={tfPercentage} onChange={handleTfChange} />
                    <PercentageDisplay>{100 - tfPercentage}%</PercentageDisplay>
                </SliderWrapper>
            </MbtiDiv>
            <MbtiDiv>
                <LabelWrapper>
                    <LeftDiv>J</LeftDiv>
                    <RightDiv>P</RightDiv>
                </LabelWrapper>
                <SliderWrapper>
                    <PercentageDisplay>{pjPercentage}%</PercentageDisplay>
                    <MbtiRange type="range" min="0" max="100" step="5" value={pjPercentage} onChange={handlePjChange} />
                    <PercentageDisplay>{100 - pjPercentage}%</PercentageDisplay>
                </SliderWrapper>
            </MbtiDiv>

            <UserMbti>
                <MbtiResult partcheck={userMbti.ie}>{userMbti.ie}</MbtiResult>
                <MbtiResult partcheck={userMbti.ns}>{userMbti.ns}</MbtiResult>
                <MbtiResult partcheck={userMbti.tf}>{userMbti.tf}</MbtiResult>
                <MbtiResult partcheck={userMbti.pj}>{userMbti.pj}</MbtiResult>
            </UserMbti>

            <MbtiUpdate>
                <MbtiMessage mbticheck={mbtiCheck}>{mbtiMessage}</MbtiMessage>
                <UpdateButton mbticheck={mbtiCheck} onClick={handleUpdate}>
                    저장하기
                </UpdateButton>
            </MbtiUpdate>
        </Container>
    )
}

export default MbtiContainer
