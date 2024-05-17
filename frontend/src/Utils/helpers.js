const formatDate = (dateString) => {
    const currentDate = new Date()
    const createdDate = new Date(dateString)
    const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime())
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    return `${daysDiff}일전`
}

export default formatDate;