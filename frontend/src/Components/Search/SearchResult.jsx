import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import style from "./SearchResult.module.css"
import searchDropdownIcon from "../../Assets/images/search/dropdown.png"
import sortDropdownIcon from "../../Assets/images/search/sort.png"
import apiClient from "../../services/apiClient";
import SearchPost from "./SearchPost";
import Pagination from "../Pagenation/Pagination";
import {getMainColor} from "../../Utils/helpers";


const SearchPostList = ({keyword, posts, searchCount}) => {
    const [isSearchFilterOpen, setSearchFilterOpen] = useState(false)
    const [isSortOpen, setSortOpen] = useState(false)

    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [posts])

    const toggleSearchFilterDropdown = () => {
        setSearchFilterOpen(!isSearchFilterOpen)
    }

    const toggleSortDropdown = () => {
        setSortOpen(!isSortOpen)
    }


    return (
        <div className={style.list_container}>
            <div className={style.search_result_title}>
                <h2>{keyword}</h2>
                <p>검색결과</p>
            </div>
            <div className={style.search_filter}>
                <div className={style.dropdown}>
                    <div className={style.dropdown_button}>
                        <button onClick={toggleSearchFilterDropdown}>
                            전체보기
                            <img src={searchDropdownIcon} alt="Dropdown Icon"/>
                        </button>
                    </div>
                    {(isSearchFilterOpen &&
                        <div className={style.dropdown_menu}>
                            <button className={style.dropdown_item}>제목+내용</button>
                            <button className={style.dropdown_item}>제목</button>
                            <button className={style.dropdown_item}>내용</button>
                        </div>
                    )}
                </div>
                <div className={style.dropdown}>
                    <div className={style.dropdown_button}>
                        <button onClick={toggleSortDropdown}>
                            최신순
                            <img src={sortDropdownIcon} alt="Dropdown Icon"/>
                        </button>
                    </div>
                    {(isSortOpen &&
                        <div className={style.dropdown_menu}>
                            <button className={style.dropdown_item}>최신순</button>
                            <button className={style.dropdown_item}>좋아요순</button>
                            <button className={style.dropdown_item}>댓글순</button>
                        </div>
                    )}
                </div>
            </div>
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
                <SearchPostList keyword={keyword} posts={searchPosts} searchCount={searchCount}/>

                {/*<h2>댓글 검색 결과 {searchPosts.length}건</h2>*/}
                <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePageChange}/>
            </div>

        </>
    )
}

export default SearchResult;