import apiClient from '../../services/apiClient'
import { useState, useEffect } from 'react'
import style from './HotList.module.css'
import { getFontColor } from 'Utils/helpers'

const HotList = () => {
    const [hotList, setHotList] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiClient.get('api/posts/hot/?limit=6')
                setHotList(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className={style.contentsContainer}>
            <div className={style.contents}>
                {hotList &&
                    hotList.map((hot) => (
                        <div className={style.content} key={hot.id}>
                            <div className={style.hotCategory} style={{ color: getFontColor(hot.mbti[0]) }}>
                                {hot.category}
                            </div>
                            <a className={style.hotTitle} href={`/detail/${hot.id}?mbti=${hot.mbti[0]}&boardMbti=${hot.mbti[0]}`}>
                                {hot.title.length > 20 ? hot.title.slice(0, 20) + '...' : hot.title}
                                <span className={style.hotComment} style={{ color: getFontColor(hot.mbti[0]) }}>
                                    [ {hot.comments} ]
                                </span>
                            </a>
                            <div className={style.hotInfos}>
                                <span className={style.hotAuthor}>{hot.author}</span>
                                <span className={style.hotLikes}> ❤️ {hot.likes}</span>
                            </div>
                        </div>
                    ))}

                <div className={style.moreDot}>...</div>
            </div>
        </div>
    )
}

export default HotList
