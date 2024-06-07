import React, { useEffect, useState, useRef, useContext } from 'react'
import style from './ChattingRoom.module.css'
import { UserContext } from '../../userContext'
import { ConnectContactLens } from 'aws-sdk'

const ChatLeft = ({ host, members, handleHostChange, handleExpel }) => {
    const currentUser = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [activeMember, setActiveMember] = useState(null)
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
    const memberRefs = useRef([])

    const changeHost = (member) => () => {
        handleHostChange(member)
    }
    const expelMember = (member) => () => {
        handleExpel(member)
    }

    const MemberModal = ({ member, host, onClose, position }) => {
        return (
            <div className={style.member_modal} style={{ top: `${position.top}px`, left: `${position.left}px` }}>
                <div className={style.member_modal_content} onClick={(e) => e.stopPropagation()}>
                    <div className={style.member_modal_menu}>
                        <a href={`/profile/${member}/`} target="_blank">
                            <div className={style.member_modal_menu_item}>프로필 보기</div>
                        </a>
                        {host === currentUser.username ? (
                            <>
                                <a onClick={changeHost(member)}>
                                    <div className={style.member_modal_menu_item}>방장 위임하기</div>
                                </a>
                                <a onClick={expelMember(member)}>
                                    <div className={style.member_modal_menu_item}>강퇴하기</div>
                                </a>
                            </>
                        ) : null}

                        <div className={style.member_modal_menu_item} onClick={onClose}>
                            닫기
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        setIsLoading(false)

        const handleClickOutside = (event) => {
            if (activeMember && !memberRefs.current.some((ref) => ref && ref.contains(event.target))) {
                setActiveMember(null)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [activeMember])

    if (isLoading) {
        return <div>Loading...</div>
    }

    const handleMemberClick = (member, index) => {
        const rect = memberRefs.current[index].getBoundingClientRect()
        const modalLeft = rect.left + rect.width / 2 + window.scrollX - 100 // Adjust 100px to the left
        setModalPosition({ top: rect.bottom + window.scrollY, left: modalLeft })
        setActiveMember(member)
    }

    const handleCloseModal = () => {
        setActiveMember(null)
    }

    return (
        <div className={style.Room_left_container}>
            <h2>참여자 목록</h2>
            <div className={style.chatMemberList}>
                {members.map((member, index) => (
                    <div style={{ position: 'relative' }} key={index} ref={(el) => (memberRefs.current[index] = el)}>
                        {member === host && (
                            <sup style={{ position: 'absolute', fontSize: 20, top: 0, right: 0 }}>👑</sup>
                        )}

                        <a
                            className={style.chatMembers}
                            onClick={() => handleMemberClick(member, index)}
                            rel="noopener noreferrer"
                        >
                            {member}
                        </a>

                        {activeMember === member && member !== currentUser.username && (
                            <MemberModal
                                member={member}
                                host={host}
                                onClose={handleCloseModal}
                                position={modalPosition}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatLeft
