import React from 'react'
import style from "./Pagination.module.css"

const Pagination = ({currentPage, totalPages, onPageChange}) => {
    // console.log(currentPage, totalPages)
    const getPageRange = () => {
        const maxPageCount = 5
        const startIndex = maxPageCount * Math.floor((currentPage - 1) / maxPageCount)
        const startPage = Math.max(startIndex + 1, 1)
        const endPage = Math.min(startIndex + 5, totalPages)
        return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i)
    }

    const handlePageChange = (newPage) => {
        if(newPage > 0 && newPage <= totalPages) {
            onPageChange(newPage)
        }
    }

    return (
        <div className={style.pagination_wrapper}>
            <button onClick={() => handlePageChange(1)}>
                {'<<'}
            </button>

            <button onClick={() => handlePageChange(currentPage - 1)}>
                {'<'}
            </button>

            {getPageRange().map((page) => (
                <button key={page} onClick={() => handlePageChange(page)} disabled={currentPage === page}>
                    {page}
                </button>
            ))}

            <button onClick={() => handlePageChange(currentPage + 1)}>
                {'>'}
            </button>

            <button onClick={() => handlePageChange(totalPages)}>
                {'>>'}
            </button>
        </div>
    )
}

export default Pagination
