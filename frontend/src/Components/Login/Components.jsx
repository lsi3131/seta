import styled from 'styled-components'

export const BodyContainer = styled.div`
    width: 100%;
    margin-top: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const Container = styled.div`
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 800px;
    max-width: 100%;
    min-height: 500px;
`

export const SignUpContainer = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 2;
    ${(props) =>
        props.signin !== 'true'
            ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
`
            : null}
`

export const SignInContainer = styled.div`
    position: absolute;
    top: 0;
    margin-top: 110px;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    z-index: 3;
    ${(props) => (props.signin !== 'true' ? `transform: translateX(100%);` : null)}
`

export const Form = styled.form`
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
`

export const Title = styled.h1`
    font-weight: bold;
    margin-bottom: 10px;
`

export const Input = styled.input`
    background-color: #eee;
    border: none;
    padding: 12px 18px;
    margin: 4px 0;
    width: 100%;
    border-radius: 20px;
`

export const Button = styled.button`
    border-radius: 20px;
    border: 1px solid black;
    background-color: black;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    margin-top: 15px;
    &:active {
        transform: scale(0.95);
    }
    &:focus {
        outline: none;
    }

    &:hover {
        transform: scale(0.95);
        cursor: pointer;
    }
`
export const GhostButton = styled(Button)`
    background-color: transparent;
    border-color: black;
    color: black;
`

export const Anchor = styled.a`
    color: #ccc;
    font-size: 14px;
    text-decoration: none;
    margin-top: 7px;
    
    &:hover{
        color: #333;
    }
`
export const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
    ${(props) => (props.signin !== 'true' ? `transform: translateX(-100%);` : null)}
`

export const Overlay = styled.div`
    background: rgb(225, 255, 220);
    background: linear-gradient(
        90deg,
        rgba(225, 255, 220, 1) 14%,
        rgba(255, 243, 220, 1) 37%,
        rgba(240, 220, 255, 1) 64%,
        rgba(225, 253, 254, 1) 90%
    );
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: black;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    ${(props) => (props.signin !== 'true' ? `transform: translateX(50%);` : null)}
`

export const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`

export const LeftOverlayPanel = styled(OverlayPanel)`
    transform: translateX(-20%);
    ${(props) => (props.signin !== 'true' ? `transform: translateX(0);` : null)}
`

export const RightOverlayPanel = styled(OverlayPanel)`
    right: 0;
    transform: translateX(0);
    ${(props) => (props.signin !== 'true' ? `transform: translateX(20%);` : null)}
`

export const Paragraph = styled.p`
    font-size: 16px;
    font-weight: 200;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 10px 0 5px;
`

export const ParaBox = styled.div`
    width: 100%;
    padding: 5px 10px;
    border-radius: 10px;
`
export const Span = styled.span`
    font-size: 10px;
    height: 10px;
`



// Modal 
export const EmailModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

export const ModalVertical = styled.div`
    width: 300px;
    height: 200px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    padding: 10px;
    background-color: #fff;
`


export const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`


export const ModalH3 = styled.h3`
    text-align: center;
    padding: 15px 0px;
    font-size: 23px;
`

export const ModalP = styled.p`
    text-align: center;
    padding-top: 5px;
    font-size: 16px;
`

export const ModalButton = styled.button`
    border-radius: 20px;
    border: 1px solid black;
    background-color: black;
    color: #ffffff;
    width: 70px;
    height: 30px;
    font-size: 15px;
    font-weight: bold;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    margin-top: 15px;
    text-decoration: none;

    &:hover {
        transform: scale(0.95);
        cursor: pointer;
    }

    a {
        color: #ffffff;
        text-decoration: none;
        display: block;
        width: 100%;
        height: 100%;
        line-height: 30px;
        text-align: center;
        transition: color 0.3s;
    }
`;