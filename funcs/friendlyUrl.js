
createSlugWithDate = (title) => {
    newTitle = title.replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(' ')
    .join('-')
    withDate = `${newTitle}-${Date.now()}`
    return withDate
}

createSlug = (title) => {
    newTitle = title.replace(/[^a-zA-Z0-9 ]/g, "")
        .toLowerCase()
        .split(' ')
        .join('-')
    return newTitle
}

module.exports = { createSlugWithDate, createSlug }