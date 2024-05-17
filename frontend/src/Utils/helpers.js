export const formatDate = (dateString) => {
    const currentDate = new Date()
    const createdDate = new Date(dateString)
    const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime())
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    return `${daysDiff}일전`
}

const mbtiParams = {
    "intj": {
        image: require("../Assets/images/intj.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "intp": {
        image: require("../Assets/images/intp.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "entj": {
        image: require("../Assets/images/entj.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "entp": {
        image: require("../Assets/images/entp.jpg"), mainColor: "#F0DCFF",
        fontColor: "#DDB0FF", buttonColor: "#DDB0FF"
    },
    "esfp": {
        image: require("../Assets/images/esfp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "estp": {
        image: require("../Assets/images/estp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "isfp": {
        image: require("../Assets/images/isfp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "istp": {
        image: require("../Assets/images/istp.jpg"), mainColor: "#FFF3DC",
        fontColor: "#FFA800", buttonColor: "#FFA800"
    },
    "esfj": {
        image: require("../Assets/images/esfj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "isfj": {
        image: require("../Assets/images/isfj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "istj": {
        image: require("../Assets/images/istj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "estj": {
        image: require("../Assets/images/estj.jpg"), mainColor: "#72C9CB77",
        fontColor: "#72C9CB", buttonColor: "#72C9CB8F"
    },
    "infj": {
        image: require("../Assets/images/infj.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "infp": {
        image: require("../Assets/images/infp.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "enfj": {
        image: require("../Assets/images/enfj.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
    "enfp": {
        image: require("../Assets/images/enfp.jpg"), mainColor: "#E1FFDC",
        fontColor: "#73C964", buttonColor: "#73C964"
    },
}

export const getImage = (mbti) => {
    if (mbti === null) {
        return ""
    }
    return mbtiParams[mbti.toLowerCase()].image
}

export const getMainColor = (mbti) => {
    if (mbti === null) {
        return ""
    }

    return mbtiParams[mbti.toLowerCase()].mainColor
}
export const getFontColor = (mbti) => {
    if (mbti === null) {
        return ""
    }

    return mbtiParams[mbti.toLowerCase()].fontColor
}

export const getButtonColor = (mbti) => {
    if (mbti === null) {
        return ""
    }

    return mbtiParams[mbti.toLowerCase()].buttonColor
}
