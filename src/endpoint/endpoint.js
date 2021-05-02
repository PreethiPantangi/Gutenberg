const baseUrl = 'http://skunkworks.ignitesol.com:8000/books/'

export const getBooksByGenreUrl = (genre, pageNum) => {
    return `${baseUrl}?mime_type=image%2Fjpeg&page=${pageNum}&topic=${genre}`
}

export const getBooksBySearchUrl = (searchWord, genre) => {
    return `${baseUrl}?mime_type=image%2Fjpeg&search=${searchWord}&topic=${genre}`
}