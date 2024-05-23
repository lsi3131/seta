import React, { useEffect, useState, useContext } from "react";
import style from "./ProfileMyPosts.module.css"
import apiClient from "services/apiClient";
import { Link } from "react-router-dom";
import { formatDateDayBefore, getFontColor, getButtonColor } from "../../Utils/helpers"
import Pagination from '../Pagenation/Pagination'
import { UserContext } from "userContext";



const ProfileMyPost = () => {
    const [view, setView] = useState('posts')
    const [posts, setPosts] = useState()
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const currentUser = useContext(UserContext)

    console.log(currentUser)

    useEffect(() => {

        async function fetchData(page = 1) {
            try {
                const response = await apiClient.get(`api/accounts/${currentUser.username}/myposts/?page=${page}`)
                setPosts(response.data)
            } catch (error) {
                setError('데이터를 불러오는데 실패했습니다.')
            }
        }
        fetchData(currentPage);
    }, [currentUser ,currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    if (!posts) {
        return <div></div>
    }


    return (
        <div className={style.vertical}>
            <div className={style.board_category}>
                <button style={{fontWeight: view === 'posts'?   'bold' : '200'}} 
                onClick={() => setView('posts')}>내가 작성한 글</button>
                <button
                style={{fontWeight: view === 'like_posts'?   'bold' : '200'}} 
                onClick={() => setView('like_posts')}>좋아요 한 글</button>
            </div>
            <hr />
            {(view === 'posts' || (view === 'like_posts' )) && (
                <div key={posts.id} className={style.board_posts}>
                    {(view === 'posts' ? posts.paginated_posts.results : posts.paginated_like_posts.results).map((post) => (
                        <>
                            <div key={post.id} className={style.board_post}>
                                <div className={style.board_post_left}>
                                    <div className={style.board_post_category}>
                                        <p style={{ color: getFontColor(currentUser.mbti_type) }}>{post.category}</p>
                                    </div>
                                    <div key={post.id} className={style.board_post_title}>
                                        <Link to={`/detail/${post.id}?mbti=${post.mbti[0]}`}>{post.title}</Link>
                                        <p style={{ color: getFontColor(currentUser.mbti_type) }}>[{post.comments}]</p>
                                    </div>
                                    <div className={style.board_post_bottom}>
                                        <div>
                                            <p>{post.author}</p>
                                        </div>
                                        <div>
                                            <p>{formatDateDayBefore(post.created_at)}</p>
                                        </div>
                                        <div className={style.board_like}>
                                            <p>좋아요 {post.likes}</p>
                                        </div>
                                    </div>
                                </div>
                                <div key={post.mbti.id}>
                                    <div className={style.board_post_right}>
                                        {post.mbti.map(m => (
                                            <button style={{ backgroundColor: getButtonColor(m) }}>{m}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    ))}
                </div>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={(view === 'posts' ? posts.paginated_posts.total_page : posts.paginated_like_posts.total_page)}
                onPageChange={handlePageChange}
            />
        </div>
    )
}
export default ProfileMyPost



