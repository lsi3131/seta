import React, { useEffect, useState, useContext } from "react";
import style from "./MyPosts.module.css"
import apiClient from "services/apiClient";
import { Link, useNavigate,useLocation } from "react-router-dom";
import Pagination from '../Pagenation/Pagination'
import { UserContext } from "userContext";
import MyCreatePosts from "./MyCreatePosts";
import MyLikePosts from "./MyLikePosts";
import queryString from 'query-string'



const MyPost = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, page } = queryString.parse(location.search);

    const currentUser = useContext(UserContext);
    const [view, setView] = useState(type || 'posts');
    const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
    const [posts, setPosts] = useState();



    useEffect(() => {
        async function fetchData(page = 1) {
            try {
                const response = await apiClient.get(`api/accounts/${currentUser.username}/myposts/?page=${page}`);
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData(currentPage);
    }, [currentUser ,currentPage, view]);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`?type=${view}&page=${page}`);
    };
    
    const handleViewChange = (newView) => {
        setView(newView);
        setCurrentPage(1);
        navigate(`?type=${newView}&page=1`);
    };
    


    if (!posts) {
        return <div></div>
    }


    return (
        <div className={style.vertical}>
            <div className={style.board_category}>
                <button style={{fontWeight: view === 'posts'?   'bold' : '200'}} 
                onClick={() => handleViewChange('posts')}>내가 작성한 글</button>
                <button
                style={{fontWeight: view === 'like_posts'?   'bold' : '200'}} 
                onClick={() => handleViewChange('like_posts')}>좋아요 한 글</button>
            </div>
            <hr />
            {view === 'posts' ?
                (<MyCreatePosts posts={posts.paginated_posts}
                user={currentUser}/>) :
                (<MyLikePosts posts={posts.paginated_like_posts}
                user={currentUser}/>)
            }
            <Pagination
                currentPage={currentPage}
                totalPages={(view === 'posts' ? posts.paginated_posts.total_page : posts.paginated_like_posts.total_page)}
                onPageChange={handlePageChange}
            />
        </div>
    )
}
export default MyPost



