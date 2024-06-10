import React, { useState } from "react";
import style from "./Modal.module.css"


const Modal = ({children, ModalStyles}) => {

{/*
    모달 open, close 방법
    const [isModalOpen, setModalOpen] = useState(false)

    const isModalOppen = () =>{
        setModalOpen(true)
    }

    const isModalClose = () =>{
        setModalOpen(false)
    }

    --------------------------------

    <button onClick={isModalOppen}>버튼</button>

    {isModalOpen &&(<Modal ModalStyles={{width: "300px", height: "300px"}}>

    </Modal>)}
*/}

    return (
        <div className={style.Modal}>
            <div className={style.ModalVertical}
                style={ModalStyles}>
                <div>

                {children}

                </div>
            </div>
        </div>
    )
}

export default Modal

