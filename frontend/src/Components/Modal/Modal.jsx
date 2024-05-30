import React, { useState } from "react";
import style from "./Modal.module.css"


const Modal = ({children, ModalStyles}) => {

{/*
    모달 open, close 방법
    const [ModalOpen, setModalOpen] = useState(false)

    const isModalOppen = () =>{
        setModalOpen(true)
    }

    const isModalClose = () =>{
        setModalOpen(false)
    }

    --------------------------------

    <button onClick={isModalOppen}>버튼</button>

    {MoalOpen &&(
        <Moal
        ModalStyles={modal의 vertical seiz 변경 가능}
        >
        
        </Moal>
    )}
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

