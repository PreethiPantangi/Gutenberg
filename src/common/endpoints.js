const baseUrl = 'http://skunkworks.ignitesol.com:8000/books/'

export const getBooksByGenreUrl = (genre, pageNum) => {
    // return `${baseUrl}books/?topic=${genre}&page=${pageNum}`
    return `${baseUrl}?mime_type=image%2Fjpeg&topic=${genre}&page=${pageNum}`
}

export const getBooksBySearchUrl = (searchWord, genre) => {
    return `${baseUrl}?mime_type=image%2Fjpeg&search=${searchWord}&topic=${genre}`
}