import style from "./SearchResult.module.css";
import searchDropdownIcon from "../../Assets/images/search/dropdown.png";
import sortDropdownIcon from "../../Assets/images/search/sort.png";
import React, {useEffect, useRef, useState} from "react";
import {searchTypeTable, sortTypeTable} from "./SearchCommon";

const SearchFilter = ({keyword, onUpdateSearchType, onUpdateOrder}) => {
    const [isSearchFilterOpen, setSearchFilterOpen] = useState(false)
    const [isOrderOpen, setOrderOpen] = useState(false)
    const [searchIndex, setSearchIndex] = useState(0)
    const [orderIndex, setOrderIndex] = useState(0)
    const dropdownSearchRef = useRef(null);
    const dropdownSortRef = useRef(null);

    useEffect(() => {
        //post 변경에 다른 값 갱신
    }, [keyword])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownSearchRef.current && !dropdownSearchRef.current.contains(event.target)) {
            setSearchFilterOpen(false);
        }

        if (dropdownSortRef.current && !dropdownSortRef.current.contains(event.target)) {
            setOrderOpen(false);
        }

    };

    const handleSetSearchType = (index) => {
        console.log('search', index)
        setSearchIndex(index)
        setSearchFilterOpen(false)
        onUpdateSearchType(searchTypeTable[index].queryValue)
    }

    const handleSetSortType = (index) => {
        setOrderIndex(index)
        setOrderOpen(false)
        onUpdateOrder(sortTypeTable[index].queryValue)
    }

    const toggleSearchFilterDropdown = () => {
        setSearchFilterOpen(!isSearchFilterOpen)
    }

    const toggleSortDropdown = () => {
        setOrderOpen(!isOrderOpen)
    }

    return (
        <div className={style.search_filter}>
            <div className={style.dropdown} ref={dropdownSearchRef}>
                <div className={style.dropdown_button}>
                    <button onClick={toggleSearchFilterDropdown}>
                        {searchTypeTable[searchIndex].name}
                        <img src={searchDropdownIcon} alt="Dropdown Icon"/>
                    </button>
                </div>
                {(isSearchFilterOpen &&
                    <div className={style.dropdown_menu}>
                        {searchTypeTable.map((searchType, index) => (
                            <button key={index}
                                    onClick={() => handleSetSearchType(index)}>{searchType.name}</button>)
                        )}
                    </div>
                )}
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