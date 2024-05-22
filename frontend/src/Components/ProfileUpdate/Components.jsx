import styled from 'styled-components'

export const Title = styled.h2`
    font-size: 2em;
    color: rgba(60, 60, 60, 1);
    margin-bottom: 40px;
`

export const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

export const BodyContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const Containers = styled.div`
    position: relative;
    overflow: hidden;
    width: 800px;
    max-width: 100%;
    min-height: 500px;
    margin-top: 50px;
`

export const LeftMenuContainer = styled.div`
    width: 25%;
    display: inline-flex;
    flex-direction: column;
    margin-right: 40px;
`

export const MenuContainer = styled.button`
    width: 100%;
    padding: 20px 10px;
    background-color: ${(props) => (props.isActive ? 'rgba(111, 142, 255, 1)' : '#eeeeee')};
    color: ${(props) => (props.isActive ? 'white' : 'rgba(153, 153, 153, 1)')};
    border: none;
    border-bottom: 1px solid #f5f5f5;
    font-size: 1.2em;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => (props.isActive ? 'rgba(111, 142, 255, 1)' : '#f5f5f5')};
        color: ${(props) => (props.isActive ? 'white' : 'rgba(153, 153, 153, 1)')};
    }
    &:focus {
        background-color: rgba(111, 142, 255, 1);
        color: white;
    }
`

export const RightContainer = styled.div`
    width: 70%;
    display: inline-flex;
    flex-direction: column;
    background-color: #f5f5f5;
    heigth: 500px;
`

export const IntroContainer = styled.div`
    width: 100%;
    padding: 20px;
`

export const PassContainer = styled.div`
    width: 100%;
    padding: 20px;
`

export const SignoutContainer = styled.div`
    width: 100%;
    padding: 20px;
`
