import React, {useEffect, useState} from 'react'
import style from './Board.module.css'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import {formatDateDayBefore, getButtonColor, getFontColor, getImage, getMainColor} from '../../Utils/helpers'
import Pagination from '../Pagenation/Pagination'
import BoardTop from "../BoardTop/BoardTop";
import apiClient from "../../services/apiClient";

const BoardPost = ({post, mbti}) => {
    const navigate = useNavigate();

    const handleMoveToPostMbti = (postMbti) => {
        navigate(`/board/${postMbti}/`)
    }

    return (
        <>
            <div className={style.board_post}>
                <div className={style.board_post_left}>
                    <div className={style.board_post_category}>
                        <p style={{color: getFontColor(mbti)}}>{post.category}</p>
                    </div>
                    <div className={style.board_post_title}>
                        <Link to={`/detail/${post.id}?mbti=${mbti}`}>{post.title}</Link>
                        <p style={{color: getFontColor(mbti)}}>[{post.comments}]</p>
                    </div>
                    <div className={style.board_post_bottom}>
                        <div>
                            <p>{post.author}</p>
                        </div>
                        <div>
                            <p>{formatDateDayBefore(post.created_at)}</p>
                        </div>
                        <div className={style.board_like}>
                            <p>좋아요</p>
                            <p>{post.likes}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.board_post_right}>
                        {post.mbti.map((m) => (
                            <button onClick={() => handleMoveToPostMbti(m)}
                                    style={{backgroundColor: getButtonColor(m)}}>{m.toUpperCase()}</button>
                        ))}
                    </div>
                </div>
            </div>
            <hr/>
        </>
    )
}

const BoardPostList = ({mbti, posts}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [posts])

    return (
        <div>
            {posts.map((post) => (
                <>
                    <BoardPost post={post} mbti={mbti}/>
                </>
            ))}
        </div>
    )
}

const BoardCategory = ({filter, order, categories, onCategoryChanged}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [filter, order, categories])

    const handleFilter = (data) => {
        onCategoryChanged('filter', data)
    }

    const handleOrder = (data) => {
        onCategoryChanged('order', data)
    }

    const categoryButtonFontStyle = (buttonFilter) => {
        if (filter === buttonFilter) {
            return {
                fontWeight: 'bold',
            }
        }
    }

    const orderButtonFontStyle = (buttonOrder) => {
        if (order === buttonOrder) {
            return {
                fontWeight: 'bold',
            }
        }
    }

    return (
        <div>
            <div className={style.board_category}>
                <div className={style.board_category_sub}>
                    <button style={categoryButtonFontStyle('')} onClick={() => handleFilter('')}>
                        전체글
                    </button>
                    {categories.map((category) => (
                        <>
                            <button style={categoryButtonFontStyle(category.name)}
                                    onClick={() => handleFilter(category.name)}>
                                {category.name}
                            </button>
                        </>
                    ))}
                </div>
                <div className={style.board_category_sub}>
                    <button style={orderButtonFontStyle('recent')} onClick={() => handleOrder('recent')}>
                        최신순
                    </button>
                    <button style={orderButtonFontStyle('like')} onClick={() => handleOrder('like')}>
                        추천순
                    </button>
                    <button style={orderButtonFontStyle('comment')} onClick={() => handleOrder('comment')}>
                        댓글순
                    </button>
                </div>
            </div>
            <hr className={style.thick_line}/>
        </div>
    )
}

const BoardPostBox = ({mbti, posts}) => {
    return (
        <>
            <BoardPostList mbti={mbti} posts={posts}/>
        </>
    )
}

const Board = () => {
    const {mbti} = useParams()
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState('') //질문, 유머, 창작 등
    const [order, setOrder] = useState('recent') //recent, like, comment

    useEffect(() => {
        handleGetCategory()
        handlePageChange(currentPage)
    }, [mbti, currentPage, order, filter])

    const handleCategoryChanged = (type, data) => {
        if (type === 'filter') {
            setFilter(data)
            setCurrentPage(1)
        } else if (type === 'order') {
            setOrder(data)
            setCurrentPage(1)
        }
    }

    const handleGetCategory = () => {
        let url = `/api/posts/category/`
        apiClient
            .get(url)
            .then((response) => {
                setCategories(response.data)
            })
            .catch((error) => {
                console.error('Error during get posts:', error)
            })

    }

    const handlePageChange = (page) => {
        let url = `/api/posts/mbti/${mbti.toLowerCase()}/?page=${page}`
        if (filter !== '') {
            url += `&category=${filter}`
        }
        if (order !== '') {
            url += `&order=${order}`
        }

        apiClient
            .get(url)
            .then((response) => {
                setPosts(response.data['results'])
                setTotalPage(response.data['total_page'])
                setCurrentPage(page)
                console.log(posts)
            })
            .catch((error) => {
                console.error('Error during get posts:', error)
            })
    }

    return (
        <>
            <div>
                <BoardTop mbti={mbti}/>

                <BoardCategory filter={filter} order={order} categories={categories}
                               onCategoryChanged={handleCategoryChanged}/>
                <BoardPostBox mbti={mbti} posts={posts}/>

                <div className={style.board_button_container}>
                    <Link to={`/write`}>
                        <button style={{backgroundColor: getButtonColor(mbti)}}>글쓰기</button>
                    </Link>
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePageChange}/>
            </div>
        </>
    )
}
export default Board
