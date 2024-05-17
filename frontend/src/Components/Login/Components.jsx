import styled from 'styled-components'

export const BodyContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const Container = styled.div`
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 800px;
    max-width: 100%;
    min-height: 400px;
`

export const SignUpContainer = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    ${(props) =>
        props.signinIn !== true
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
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    z-index: 2;
    ${(props) => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
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
    margin: 8px 0;
    width: 100%;
    border-radius: 20px;
`

export const Button = styled.button`
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
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
`
export const GhostButton = styled(Button)`
    background-color: transparent;
    border-color: black;
    color: black;
`

export const Anchor = styled.a`
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin-top: 20px;
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
    ${(props) => (props.signinIn !== true ? `transform: translateX(-100%);` : null)}
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
    ${(props) => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
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
    ${(props) => (props.signinIn !== true ? `transform: translateX(0);` : null)}
`

export const RightOverlayPanel = styled(OverlayPanel)`
    right: 0;
    transform: translateX(0);
    ${(props) => (props.signinIn !== true ? `transform: translateX(20%);` : null)}
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
