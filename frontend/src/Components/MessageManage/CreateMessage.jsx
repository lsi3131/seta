import { useState, useEffect, useContext } from 'react'
import useDebounce from './useDebounce'
import style from './MessageManage.module.css'
import apiClient from 'services/apiClient'
import { UserContext } from 'userContext'

const CreateMessage = () => {
    const currentUser = useContext(UserContext)
    const [subject, setSubject] = useState('')
    const [recipient, setRecipient] = useState('')
    const [body, setBody] = useState('')
    const [recipientMessage, setRecipientMessage] = useState('')
    const [activeButton, setActiveButton] = useState(false)

    const debouncedRecipient = useDebounce(recipient, 500)

    useEffect(() => {
        if (debouncedRecipient && recipient === debouncedRecipient) {
            async function fetchData() {
                try {
                    const response = await apiClient.post(`api/accounts/validate/username/`, {
                        data: recipient,
                    })
                    setRecipientMessage(`존재하지 않는 계정입니다`)
                    setActiveButton(false)
                } catch (error) {
                    if (error.response.data.error.includes('이미')) {
                        if (recipient === currentUser.username) {
                            setRecipientMessage(`자신에게는 보낼 수 없습니다`)
                            setActiveButton(false)
                        } else {
                            setRecipientMessage(`${debouncedRecipient} 님께 전송됩니다`)
                            setActiveButton(true)
                        }
                    } else {
                        setRecipientMessage(`존재하지 않는 계정입니다`)
                        setActiveButton(false)
                    }
                }
            }
            fetchData()
        }
    }, [recipient, debouncedRecipient])

    const handleSend = () => {
        if (!activeButton) return
        apiClient
            .post('api/messages/', {
                sender: currentUser.username,
                recipient: recipient,
                subject: subject,
                body: body,
            })
            .then(() => {
                alert('메시지가 전송되었습니다')
                window.location.reload()
            })
    }
    return (
        <div className={style.createMessage}>
            <div>
                <input
                    type="text"
                    className={style.input_subject}
                    placeholder="제목"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <input
                    type="text"
                    className={style.input_recipient}
                    placeholder="받는 사람"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <div className={style.recipientMessage}>{recipientMessage}</div>
                <textarea
                    placeholder="내용"
                    className={style.input_content}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <button className={style.createButton} onClick={handleSend}>
                    보내기
                </button>
            </div>
        </div>
    )
}

export default CreateMessage
