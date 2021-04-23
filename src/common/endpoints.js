const baseUrl = 'http://skunkworks.ignitesol.com:8000/'

export const getBooksByGenreUrl = (genre, pageNum) => {
    // return `${baseUrl}books/?topic=${genre}&page=${pageNum}`
    return `${baseUrl}books/?mime_type=image%2Fjpeg&topic=${genre}&page=${pageNum}`
}

export const getBooksBySearchUrl = (searchWord) => {
    return `${baseUrl}books/?search=${searchWord}`
}