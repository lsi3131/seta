import React, {useEffect, useState} from 'react';
import style from './Board.module.css'
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {formatDate, getButtonColor, getFontColor, getUrl} from "../../Utils/helpers"
import Pagination from "../Pagenation/Pagination";
import BoardTop from "../BoardTop/BoardTop";

const BoardPost = ({post, mbti}) => {
    return (
        <>
            <div className={style.board_post}>
                <div className={style.board_post_left}>
                    <div className={style.board_post_category}>
                        <p style={{color: getFontColor(mbti)}}>{post.category}</p>
                    </div>
                    <div className={style.board_post_title}>
                        <Link to={`/detail/${post.id}`} state={{mbti: mbti}}>{post.title}</Link>
                        <p style={{color: getFontColor(mbti)}}>[{post.hits}]</p>
                    </div>
                    <div className={style.board_post_bottom}>
                        <div>
                            <p>{post.author}</p>
                        </div>
                        <div>
                            <p>{formatDate(post.created_at)}</p>
                        </div>
                        <div className={style.board_like}>
                            <p>좋아요</p>
                            <p>{post.likes}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.board_post_right}>
                        {post.mbti.map(m => (
                            <p style={{backgroundColor: getButtonColor(m)}}>{m}</p>
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
    }, [posts]);

    return (
        <div>
            {posts.map(post => (
                <>
                    <BoardPost post={post} mbti={mbti}/>
                </>
            ))}
        </div>
    );
}

const BoardCategory = ({filter, order, onCategoryChanged}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [filter, order]);


    const handleFilter = (data) => {
        onCategoryChanged('filter', data)
    }

    const handleOrder = (data) => {
        onCategoryChanged('order', data)
    }

    const categoryButtonFontStyle = (buttonFilter) => {
        if (filter === buttonFilter) {
            return {
                fontWeight: "bold"
            }
        }
    }

    const orderButtonFontStyle = (buttonOrder) => {
        if (order === buttonOrder) {
            return {
                fontWeight: "bold"
            }
        }
    }


    return (
        <div>
            <div className={style.board_category}>
                <div className={style.board_category_sub}>
                    <button style={categoryButtonFontStyle('')} onClick={() => handleFilter('')}>전체글</button>
                    <button style={categoryButtonFontStyle('질문')} onClick={() => handleFilter('질문')}>질문있어요</button>
                    <button style={categoryButtonFontStyle('유머')} onClick={() => handleFilter('유머')}>유머</button>
                    <button style={categoryButtonFontStyle('창작')} onClick={() => handleFilter('창작')}>창작</button>
                </div>
                <div className={style.board_category_sub}>
                    <button style={orderButtonFontStyle('recent')} onClick={() => handleOrder('recent')}>최신순</button>
                    <button style={orderButtonFontStyle('like')} onClick={() => handleOrder('like')}>추천순</button>
                    <button style={orderButtonFontStyle('comment')} onClick={() => handleOrder('comment')}>댓글순</button>
                </div>
            </div>
            <hr className={style.thick_line}/>
        </div>
    );
}


const BoardPostBox = ({mbti, posts}) => {
    return (
        <>
            <BoardPostList mbti={mbti} posts={posts}/>
        </>
    );
}


const Board = () => {
    const {mbti} = useParams()
    const [posts, setPosts] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState('')    //질문, 유머, 창작 등
    const [order, setOrder] = useState('recent')    //recent, like, comment
    const [description, setDescription] = useState('대담한 통솔가')    //recent, like, comment

    useEffect(() => {
        console.log('use effect-1')
        handlePageChange(currentPage)
    }, [currentPage, order, filter]);


    const handleCategoryChanged = (type, data) => {
        console.log('handle cate', type, data)
        if (type === 'filter') {
            setFilter(data);
            setCurrentPage(1)
        } else if (type === 'order') {
            setOrder(data);
            setCurrentPage(1)
        }
    }

    const handlePageChange = (page) => {
        const mbtiLower = mbti.toLowerCase()
        let url = getUrl(`/api/posts/mbti/${mbtiLower}/?page=${page}`)
        if (filter !== '') {
            url += `&category=${filter}`
        }
        if (order !== '') {
            url += `&order=${order}`
        }

        console.log(url)
        axios.get(url)
            .then(response => {
                setPosts(response.data['results'])
                setTotalPage(response.data['total_page'])
                setCurrentPage(page)
            }).catch(error => {
            console.error('Error during get posts:', error)
        })
    }

    return (
        <>
            <div>
                <BoardTop mbti={mbti} description={description}/>

                <BoardCategory filter={filter} order={order} onCategoryChanged={handleCategoryChanged}/>
                <BoardPostBox mbti={mbti} posts={posts}/>

                <div className={style.board_button_container}>
                    <Link to={`/write`}>
                        <button
                            style={{backgroundColor: getButtonColor(mbti)}}>
                            글쓰기
                        </button>
                    </Link>
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePageChange}/>
            </div>
        </>
    )
}
export default Board;
