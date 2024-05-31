import React, {useContext, useEffect, useState,} from 'react'
import style from './Board.module.css'
import {Link, useNavigate, useParams,} from 'react-router-dom'
import axios from 'axios'
import {formatDateDayBefore, getButtonColor, getFontColor, getImage, getMainColor} from '../../Utils/helpers'
import Pagination from '../Pagenation/Pagination'
import BoardTop from '../BoardTop/BoardTop'
import apiClient from '../../services/apiClient'
import BoardPostBox from "./BoardPostBox";
import useBoardAPI from "../../api/Hooks/useBoardAPI";
import {UserContext} from "../../userContext";



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

    const currentUser = useContext(UserContext);


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

    useEffect(() => {
        document.body.classList.add(style.customBodyStyle);

        return () => {
            document.body.classList.remove(style.customBodyStyle);
        };
    }, []);

    if (isLoading) {
        return <>Loading...</>
    }
  
    if (error) {
        return <>{error}</>
    }

    return (
        <>
            <div className={style.elevated_component}>
                <div className={style.container}>
                    {mbti === 'hot' ? (
                        <>
                            <div className={style.container_content_category}>
                                <h1 style={{fontSize:"35px", paddingBottom:"20px", paddingTop:"80px"}}>인기글</h1>
                                <h3 style={{fontSize:"18px", color:"#6B6B6B", fontWeight:"400", paddingBottom:"20px"}}>좋아요 10개 이상의 글을 모아볼 수 있습니다.</h3>
                                <hr className={style.thick_line}/>
                            </div>
                        </>
                    ) : (
                        <>
                            <BoardTop mbti={mbti}></BoardTop>
                            <div className={style.writeButton}>
                                <Link
                                    to={currentUser && currentUser.mbti_type ? `/write/` : '#'}
                                    style={{
                                        backgroundColor:
                                            currentUser && currentUser.mbti_type
                                                ? getButtonColor(currentUser.mbti_type)
                                                : '#ccc',
                                    }}
                                >
                                    글쓰기
                                </Link>
                            </div>
                            <div className={style.container_content_category}>
                                <BoardCategory
                                    filter={filter}
                                    order={order}
                                    categories={categories}
                                    onCategoryChanged={handleCategoryChanged}
                                />
                            </div>
                        </>
                    )}

                    <div className={style.container_content}>
                        <BoardPostBox boardMbti={mbti} posts={posts}/>
                        <Pagination currentPage={currentPage} totalPages={totalPage}
                                    onPageChange={handleGetPostListPage}/>

                        {/*<BoardSearch />*/}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Board
