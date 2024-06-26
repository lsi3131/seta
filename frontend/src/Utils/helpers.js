export const formatDateDayBefore = (dateString) => {
    const currentDate = new Date();
    const createdDate = new Date(dateString);
    const timeDiff = currentDate.getTime() - createdDate.getTime(); // Time difference in milliseconds
    const minutesDiff = Math.floor(timeDiff / (1000 * 60)); // Convert milliseconds to minutes
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Convert milliseconds to hours
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); 

    if (daysDiff >= 1) {
        return `${daysDiff}일 전`;
    } else if (hoursDiff >= 1) {
        return `${hoursDiff}시간 전`;
    } else {
        return `${minutesDiff}분 전`;
    }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')

    return `${year}.${month}.${day} ${hour}:${minute}`
}

export const getUpdateTime = (timestamp) => {
    const currentDate = new Date()
    const previousDate = new Date(timestamp)

    const difference = currentDate - previousDate
    const seconds = Math.floor(difference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours >= 24) {
        const year = previousDate.getFullYear()
        const month = String(previousDate.getMonth() + 1).padStart(2, '0')
        const day = String(previousDate.getDate()).padStart(2, '0')
        const hour = String(previousDate.getHours()).padStart(2, '0')
        const minute = String(previousDate.getMinutes()).padStart(2, '0')
        return `${year}.${month}.${day} ${hour}:${minute}`
    } else if (hours > 0) {
        return `${hours}시간 전`
    } else if (minutes > 0) {
        return `${minutes}분 전`
    } else {
        return `${seconds}초 전`
    }
}

// =================== MBTI 이미지 ======================
export const mbtiParams = {
    "intj": {
        image: require("../Assets/images/symbol_INTJ.png"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "intp": {
        image: require("../Assets/images/symbol_INTP.png"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "entj": {
        image: require("../Assets/images/symbol_ENTJ.png"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "entp": {
        image: require("../Assets/images/symbol_ENTP.png"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "esfp": {
        image: require("../Assets/images/symbol_ESFP.png"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "estp": {
        image: require("../Assets/images/symbol_ESTP.png"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "isfp": {
        image: require("../Assets/images/symbol_ISFP.png"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "istp": {
        image: require("../Assets/images/symbol_ISTP.png"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "esfj": {
        image: require("../Assets/images/symbol_ESFJ.png"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "isfj": {
        image: require("../Assets/images/symbol_ISFJ.png"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "istj": {
        image: require("../Assets/images/symbol_ISTJ.png"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "estj": {
        image: require("../Assets/images/symbol_ESTJ.png"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "infj": {
        image: require("../Assets/images/symbol_INFJ.png"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "infp": {
        image: require("../Assets/images/symbol_INFP.png"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "enfj": {
        image: require("../Assets/images/symbol_ENFJ.png"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "enfp": {
        image: require("../Assets/images/symbol_ENFP.png"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
}

export const getImage = (mbti) => {
    if (mbti === null) {
        return ''
    }
    if (!mbti) return null;
    
    return mbtiParams[mbti.toLowerCase()].image
}

export const getMainColor = (mbti) => {
    if (mbti === null) {
        return ''
    }
    if (!mbti) return null;

    return mbtiParams[mbti.toLowerCase()].mainColor
}
export const getFontColor = (mbti) => {
    if (mbti === null) {
        return ''
    }
    if (!mbti) return null;

    return mbtiParams[mbti.toLowerCase()].fontColor
}

export const getButtonColor = (mbti) => {
    if (mbti === null) {
        return ''
    }
    if (!mbti) return null;

    return mbtiParams[mbti.toLowerCase()].buttonColor
}

export const isValidMbti = (mbti) => {
    if(mbti === null) {
        return false;
    }

    return mbti.toLowerCase() in mbtiParams
}

