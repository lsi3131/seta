import React, {useEffect, useState,} from 'react'
import style from './Board.module.css'
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import {formatDateDayBefore, getButtonColor, getFontColor, getImage, getMainColor} from '../../Utils/helpers'
import Pagination from '../Pagenation/Pagination'
import BoardTop from '../BoardTop/BoardTop'
import apiClient from '../../services/apiClient'
import BoardPostBox from "./BoardPostBox";
import useBoardAPI from "../../api/Hooks/useBoardAPI";

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
                            <button
                                style={categoryButtonFontStyle(category.name)}
                                onClick={() => handleFilter(category.name)}
                            >
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

const Board = () => {
    const {mbti} = useParams()
    const {
        isLoading,
        error,
        posts,
        categories,
        totalPage,
        currentPage,
        order,
        filter,
        handleCategoryChanged,
        handleGetPostListPage,
    } = useBoardAPI(mbti)

    if (isLoading) {
        return <>Loading...</>
    }

    if (error) {
        return <>{error}</>
    }

    return (
        <>
            <div>
                <BoardTop mbti={mbti}/>

                <div className={style.writeButton}>
                    <Link to={`/write/`}
                          style={{backgroundColor: getButtonColor(mbti)}}
                    >글쓰기</Link>
                </div>

                <BoardCategory
                    filter={filter}
                    order={order}
                    categories={categories}
                    onCategoryChanged={handleCategoryChanged}
                />
                <BoardPostBox boardMbti={mbti} posts={posts}/>

                <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handleGetPostListPage}/>

                {/*<BoardSearch />*/}
            </div>
        </>
    )
}
export default Board
