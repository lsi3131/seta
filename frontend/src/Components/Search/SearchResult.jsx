import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import style from "./SearchResult.module.css"
import apiClient from "../../services/apiClient";
import SearchPost from "./SearchPost";
import Pagination from "../Pagenation/Pagination";


const SearchPostList = ({posts, searchCount}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [posts])

    return (
        <div className={style.list_container}>
            <h2>게시글 검색 결과 {searchCount}건</h2>
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
    const [order, setOrder] = useState('');
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchCount, setSearchCount] = useState(0)

    useEffect(() => {
        handlePageChange(1)
    }, [keyword]);

    const handlePageChange = (page) => {
        console.log('handle page')
        let url = `/api/posts/search/?page=${page}&search=${keyword}`
        if (category !== '') {
            url += `&category=${category}`
        }
        if (order !== '') {
            url += `&order=${order}`
        }

        apiClient
            .get(url)
            .then((response) => {
                console.log(response.data)
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
                <SearchPostList posts={searchPosts} searchCount={searchCount}/>

                {/*<h2>댓글 검색 결과 {searchPosts.length}건</h2>*/}
                <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePageChange}/>
            </div>

        </>
    )
}

export default SearchResult;