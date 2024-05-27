import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import style from "./SearchResult.module.css"
import apiClient from "../../services/apiClient";

const CommentPostList = ({comments}) => {

}

const SearchPost = ({post}) => {
    const navigate = useNavigate()

    const moveToPost = (postMbti) => {
        navigate(`/board/${postMbti}/`)
    }

    return (
        <div className={style.search_post_container}>
            <p>[{post.author_mbti}]</p>
            <Link to={`/detail/${post.id}?mbti=${post.author_mbti}`}>{post.title}</Link>
            <h3>{`/detail/${post.id}?mbti=${post.author_mbti}`}</h3>
            <p>{post.content}</p>
        </div>
    )
}

const SearchPostList = ({posts}) => {
    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [posts])

    return (
        <div className={style.search_post_list_container}>
            <h2>게시글 검색 결과 {posts.length}건</h2>
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
                setSearchPosts(response.data['results'])
                // setTotalPage(response.data['total_page'])
                // setCurrentPage(page)
            })
            .catch((error) => {
                console.error('Error during get posts:', error)
            })
    }


    return (
        <>
            <SearchPostList posts={searchPosts}/>
            <hr/>

            {/*<h2>댓글 검색 결과 {searchPosts.length}건</h2>*/}
            {/*<hr/>*/}

        </>
    )
}

export default SearchResult;