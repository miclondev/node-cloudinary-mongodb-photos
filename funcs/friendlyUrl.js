
createSlugWithDate = (title) => {
    newTitle = title.toLowerCase().split(' ').join('-')
    withDate = `${newTitle}-${Date.now()}`
    return withDate
}

createSlug = (title) => {
    newTitle = title.toLowerCase().split(' ').join('-')
    return newTitle
}

module.exports = { createSlugWithDate, createSlug }