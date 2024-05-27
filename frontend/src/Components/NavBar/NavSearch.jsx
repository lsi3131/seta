// src/components/NavSearch.js
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css'; // FontAwesome CSS를 import

const NavSearch = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState();

    const styles = {
        searchBarContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '20px',
        },
        searchBarWrapper: {
            display: 'flex',
            alignItems: 'center',
            border: '2px solid #E18B32',
            borderRadius: '25px',
            padding: '5px 10px',
        },
        searchIcon: {
            fontSize: '20px',
            color: '#E18B32',
            marginRight: '10px',
        },
        searchBar: {
            width: '250px',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            padding: '10px',
            borderRadius: '25px',
        },
        placeholder: {
            color: '#cdcdcd', // placeholder 색상 변경
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            navigate(`/search/?keyword=${keyword}`); // Enter 키를 눌렀을 때 "/search" 페이지로 이동
        }
    };

    return (
        <>
            <style>
                {`
                    .searchBar::placeholder {
                    color: ${styles.placeholder.color};
                    }
                `}
            </style>
            <div style={styles.searchBarContainer}>
                <div style={styles.searchBarWrapper}>
                    <i className="fas fa-search" style={styles.searchIcon}></i>
                    <input type="text" placeholder="궁금하신게 있으신가요?" style={styles.searchBar} className="searchBar"
                           onKeyPress={handleKeyPress} value={keyword}
                           onChange={(e)=>setKeyword(e.target.value)}
                    />
                </div>
            </div>
        </>
    );
};

export default NavSearch;
