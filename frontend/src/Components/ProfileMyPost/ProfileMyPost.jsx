import React, { useEffect, useState, useContext } from "react";
import style from "./ProfileMyPost.module.css"
import apiClient from "services/apiClient";
import { Link } from "react-router-dom";
import { formatDate, getFontColor, getButtonColor } from "../../Utils/helpers"
import Pagination from '../Pagenation/Pagination'
import { UserContext } from "userContext";



const ProfileMyPost = (users) => {
    const [view, setView] = useState('posts')
    const [posts, setPosts] = useState()
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const currentUser = useContext(UserContext)
    const user = users.props

    useEffect(() => {
        if (!user || !user.username) {
            return;
        }

        async function fetchData(page = 1) {
            try {
                const response = await apiClient.get(`api/accounts/${user.username}/myposts/?page=${page}`)

                if (response.data.paginated_like_posts) {
                    setPosts({
                        posts: response.data.paginated_posts,
                        like_posts: response.data.paginated_like_posts
                    })
                } else {
                    setPosts({
                        posts: response.data.paginated_posts,
                        like_posts: null
                    })
                }

            } catch (error) {
                setError('데이터를 불러오는데 실패했습니다.')
            }
        }
        fetchData(currentPage);
    }, [user, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (!posts) {
        return <div></div>
    }

    return (
        <div className={style.board_contents}>
            <div className={style.board_category}>
                <button onClick={() => setView('posts')}>내가 작성한 글</button>
                {user.username === currentUser.username && (
                    <button onClick={() => setView('like_posts')}>좋아요 한 글</button>
                )}
            </div>
            <hr />
            {(view === 'posts' || (view === 'like_posts' && posts.like_posts !== null)) && (
                <div key={posts.id} className={style.board_posts}>
                    {(view === 'posts' ? posts.posts.results : posts.like_posts.results).map((post) => (
                        <>
                            <div key={post.id} className={style.board_post}>
                                <div className={style.board_post_left}>
                                    <div className={style.board_post_category}>
                                        <p style={{ color: getFontColor(user.mbti) }}>{post.category}</p>
                                    </div>
                                    <div key={post.id} className={style.board_post_title}>
                                        <Link to={`/detail/${post.id}`}>{post.title}</Link>
                                        <p style={{ color: getFontColor(user.mbti) }}>[{post.hits}]</p>
                                    </div>
                                    <div className={style.board_post_bottom}>
                                        <div>
                                            <p>{post.author}</p>
                                        </div>
                                        <div>
                                            <p>{formatDate(post.created_at)}</p>
                                        </div>
                                        <div className={style.board_like}>
                                            <p>좋아요 {post.likes}</p>
                                        </div>
                                    </div>
                                </div>
                                <div >
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
                totalPages={(view === 'posts' ? posts.posts.total_page : posts.like_posts !== null ? posts.like_posts.total_page : 0)}
                onPageChange={handlePageChange}
            />
        </div>
    )
}
export default ProfileMyPost



