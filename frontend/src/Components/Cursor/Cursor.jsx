import { useEffect } from 'react'

function Cursor() {
    useEffect(() => {
        const body = document.body
        let cursor = null

        // 마우스 이동 이벤트 핸들러
        const handleMouseMove = (event) => {
            if (!cursor) {
                createCursor()
            }
            updateCursor(event.clientX - 20, event.clientY - 20)
        }

        body.addEventListener('mousemove', handleMouseMove)

        // 컴포넌트 언마운트 시 이벤트 리스너를 제거합니다.
        return () => {
            body.removeEventListener('mousemove', handleMouseMove)
        }

        // 커서를 생성하는 함수
        function createCursor() {
            cursor = document.createElement('div')
            cursor.classList.add('cursor')
            body.appendChild(cursor)
        }

        // 커서 위치를 업데이트하는 함수
        function updateCursor(x, y) {
            cursor.style.left = x + 'px'
            cursor.style.top = y + 'px'
        }
    }, [])
}

export default Cursor
