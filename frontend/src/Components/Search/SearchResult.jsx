import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import style from "./SearchResult.module.css"
import apiClient from "../../services/apiClient";
import SearchPost from "./SearchPost";
import Pagination from "../Pagenation/Pagination";
import SearchFilter from "./SearchFilter";


const SearchPostList = ({posts}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [posts])

    return (
        <div className={style.list_container}>
            {posts.map((post) => (
                <>
                    <SearchPost post={post}/>
                </>
            ))}
        </div>
    )
}

const SearchResult = ({}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    const [searchPosts, setSearchPosts] = useState([]);
    const [category, setCategory] = useState('');
    const [searchType, setSearchType] = useState('title_content');
    const [order, setOrder] = useState('');
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchCount, setSearchCount] = useState(0)


    useEffect(() => {
        handlePageChange(1)
    }, [keyword, searchType, category, order]);

    useEffect(() => {
    }, [searchPosts]);


    const handleUpdateSearchType = (value) => {
        setSearchType(value)
    }

    const handleCategory = (value) => {
        setCategory(value)
    }

    const handleUpdateOrder = (value) => {
        setOrder(value)
    }

    const handlePageChange = (page) => {
        let url = `/api/posts/search/?page=${page}&search=${keyword}&searchType=${searchType}`
        if (category !== '') {
            url += `&category=${category}`
        }
        if (order !== '') {
            url += `&order=${order}`
        }

        console.log(url)

        apiClient
            .get(url)
            .then((response) => {
                setSearchPosts(response.data['results'])
                setSearchCount(response.data['count'])
                setTotalPage(response.data['total_page'])
                setCurrentPage(page)
            })
            .catch((error) => {
                console.error('Error during get posts:', error)
            })
    }


    return (
        <>
            <div className={style.container}>
                <div className={style.search_result_title}>
                    <h2>{keyword}</h2>
                    <p>검색결과 - {searchCount}건</p>
                </div>
                <SearchFilter keyword={keyword}
                              onUpdateSearchType={handleUpdateSearchType}
                              onUpdateCategory={handleCategory}
                              onUpdateOrder={handleUpdateOrder}/>
                <SearchPostList posts={searchPosts}/>

                {/*<h2>댓글 검색 결과 {searchPosts.length}건</h2>*/}
                <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePageChange}/>
            </div>

        </>
    )
}

export default SearchResult;