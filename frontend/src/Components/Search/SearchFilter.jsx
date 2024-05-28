import style from "./SearchFilter.module.css"
import searchDropdownIcon from "../../Assets/images/search/dropdown.png";
import sortDropdownIcon from "../../Assets/images/search/sort.png";
import React, {useEffect, useRef, useState} from "react";
import apiClient from "../../services/apiClient";

const searchTypeTable = [
    {name: '제목+내용', queryValue: 'title_content'},
    {name: '제목', queryValue: 'title'},
    {name: '내용', queryValue: 'content'},
    {name: '작성자', queryValue: 'author'},
]

const sortTypeTable = [
    {name: '최신순', queryValue: 'recent'},
    {name: '좋아요순', queryValue: 'like'},
    {name: '댓글순', queryValue: 'comment'},
]


const SearchFilter = ({keyword, onUpdateSearchType, onUpdateCategory, onUpdateOrder}) => {
    const [isSearchTypeOpen, setSearchTypeOpen] = useState(false)
    const [isCategoryOpen, setCategoryOpen] = useState(false)
    const [isOrderOpen, setOrderOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [searchIndex, setSearchIndex] = useState(0)
    const [categoryIndex, setCategoryIndex] = useState(0)
    const [orderIndex, setOrderIndex] = useState(0)
    const [categoryTable, setCategoryTable] = useState([])
    const dropdownCategoryRef = useRef(null);
    const dropdownSearchRef = useRef(null);
    const dropdownSortRef = useRef(null);

    useEffect(() => {
    }, [keyword])

    useEffect(() => {
        updateCategoryTable();

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const updateCategoryTable = () => {
        let url = `/api/posts/category/`

        apiClient
            .get(url)
            .then((response) => {
                /* categoryTable 업데이트 [name: <name>, queryValue: <queryValue>, ... ]>*/
                let categoryTable = [{name: '전체보기', queryValue: ''}]
                response.data.map(data => {
                    let category = {
                        name: data.name,
                        queryValue: data.name
                    }
                    categoryTable.push(category)
                })

                setCategoryTable(categoryTable);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error during get posts:', error)
            })
    }

    const handleClickOutside = (event) => {
        if (dropdownSearchRef.current && !dropdownSearchRef.current.contains(event.target)) {
            setSearchTypeOpen(false);
        }

        if (dropdownSortRef.current && !dropdownSortRef.current.contains(event.target)) {
            setOrderOpen(false);
        }

        if (dropdownCategoryRef.current && !dropdownCategoryRef.current.contains(event.target)) {
            setCategoryOpen(false);
        }
    };

    const handleSetSearchType = (index) => {
        setSearchIndex(index)
        setSearchTypeOpen(false)
        onUpdateSearchType(searchTypeTable[index].queryValue)
    }

    const handleSetCategory = (index) => {
        setCategoryIndex(index)
        setCategoryOpen(false)
        onUpdateCategory(categoryTable[index].queryValue)
    }

    const handleSetSortType = (index) => {
        setOrderIndex(index)
        setOrderOpen(false)
        onUpdateOrder(sortTypeTable[index].queryValue)
    }

    const toggleSearchFilterDropdown = () => {
        setSearchTypeOpen(!isSearchTypeOpen)
    }

    const toggleCategoryDropdown = () => {
        setCategoryOpen(!isCategoryOpen)
    }

    const toggleSortDropdown = () => {
        setOrderOpen(!isOrderOpen)
    }

    if(isLoading) {
        return <></>
    }

    return (
        <div className={style.search_filter}>
            <div className={style.horizontal}>
                <div className={style.dropdown} ref={dropdownSearchRef}>
                    <div className={style.dropdown_button}>
                        <button onClick={toggleSearchFilterDropdown}>
                            {searchTypeTable[searchIndex].name}
                            <img src={searchDropdownIcon} alt="Dropdown Icon"/>
                        </button>
                    </div>
                    {(isSearchTypeOpen &&
                        <div className={style.dropdown_menu}>
                            {searchTypeTable.map((searchType, index) => (
                                <button key={index}
                                        onClick={() => handleSetSearchType(index)}>{searchType.name}</button>)
                            )}
                        </div>
                    )}
                </div>
                <div className={style.dropdown} ref={dropdownCategoryRef}>
                    <div className={style.dropdown_button}>
                        <button onClick={toggleCategoryDropdown}>
                            {categoryTable[categoryIndex].name}
                            <img src={searchDropdownIcon} alt="Dropdown Icon"/>
                        </button>
                    </div>
                    {(isCategoryOpen &&
                        <div className={style.dropdown_menu}>
                            {categoryTable.map((category, index) => (
                                <button key={index}
                                        onClick={() => handleSetCategory(index)}>{category.name}</button>)
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className={style.dropdown} ref={dropdownSortRef}>
                <div className={style.dropdown_button}>
                    <button onClick={toggleSortDropdown}>
                        {sortTypeTable[orderIndex].name}
                        <img src={sortDropdownIcon} alt="Dropdown Icon"/>
                    </button>
                </div>
                {(isOrderOpen &&
                    <div className={style.dropdown_menu}>
                        {sortTypeTable.map((sortType, index) => (
                            <button key={index}
                                    onClick={() => handleSetSortType(index)}>{sortType.name}</button>)
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchFilter;