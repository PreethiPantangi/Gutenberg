import './BookDetails.css'
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useHistory, useParams } from 'react-router';
import Back from '../../assets/images/Back.svg'
import axios from 'axios';
import { getBooksByGenreUrl, getBooksBySearchUrl } from '../../endpoint/endpoint'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
        width: '100%'
    },
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "auto",
        height: '70vh',
        backgroundColor: theme.palette.background.paper
    },
    gridList: {
        width: "100%",
        height: "100%"
    },
    gridListItem: {
        cursor: "pointer",
        justifyContent: 'space-between',
    }
}));

const BookDetailsComponent = () => {

    const classes = useStyles();

    const BookFormatLevel = [
        "text/html",
        "application/pdf",
        "text/plain; charset=utf-8:"
    ];


    const params = useParams();
    let history = useHistory();
    let genre = params.name;
    const [pageNum, setPageNum] = useState(1);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchWord, setSearchWord] = useState('');
    const [next, setNext] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const goBack = () => {
        history.goBack()
    }

    const handleChange = (event, value) => {
        fetchBooks(value);
        setSearchWord('')
        setPage(value);
    };

    const fetchBooks = (pageNumber) => {
        setIsLoading(true)
        axios.get(getBooksByGenreUrl(genre, pageNumber))
            .then(res => {
                const { results, next } = res.data;
                const booksResp = results
                    .map(({ id, formats, title, authors }) => ({
                        id,
                        image: formats["image/jpeg"],
                        formats,
                        title,
                        author: authors[0] && authors[0].name
                    }))
                if (isInitialLoading && next !== null) {
                    setPageNum(pageNum + 1)
                    setIsInitialLoading(false)
                }
                if (next !== null) {
                    setPageNum(pageNum + 1)
                }
                setNext(next)
                setBooks([...booksResp])
                setFilteredBooks([...booksResp])
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }

    const getBooksBySearch = (e) => {
        if (e.keyCode === 13) {
            fetchBooksBySearch()
        }
    }

    const fetchBooksBySearch = () => {
        setIsLoading(true)
        axios.get(getBooksBySearchUrl(searchWord, genre)).then(res => {
            const { results, next } = res.data;
            const booksResp = results
                .map(({ id, formats, title, authors }) => ({
                    id,
                    image: formats["image/jpeg"],
                    formats,
                    title,
                    author: authors[0] && authors[0].name
                }))
            setNext(next)
            setFilteredBooks([...booksResp])
            setIsLoading(false)
        }).catch(err => {
            console.log(err);
        })
    }

    const onClickGridItem = (id) => {
        let formats;
        if (filteredBooks) {
            filteredBooks.forEach(book => {
                if (book.id === id) {
                    formats = book.formats;
                }
            })
        }
        let found = false;
        BookFormatLevel.forEach(format => {
            const formatLink = Object.keys(formats).find(bookFormat => {
                return bookFormat.includes(format);
            });
            if (formatLink) {
                window.open(formats[formatLink], '_blank')
                found = true;
            }
        });
        if (!found) {
            alert('Not found')
        }
    };

    useEffect(() => {
        fetchBooks(pageNum)
        // setIsInitialLoading(true)
    }, [])

    return (
        <div className="book_details_component" >
            <Grid>
                <Grid item xs={12}>
                    <div className="bdc_header" >
                        <img src={Back} onClick={goBack} style={{ width: "50", top: '10', cursor: 'pointer' }} alt="" />
                        <span style={{ color: '#5E56E7', fontFamily: 'Montserrat-Regular', fontSize: '25px', padding: '1%', marginLeft: '3%', fontWeight: 'bold' }}>
                            {genre}
                        </span>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className="bdc_search">
                        <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            placeholder="Search by bookname, author..."
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                            onKeyDown={getBooksBySearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className={classes.root} >
                        {isLoading ? <div><CircularProgress /></div> : (!isLoading && filteredBooks.length === 0 ? <div>There are no results to display!</div> : filteredBooks.map(book =>
                            <GridListTile
                                className={classes.gridListItem}
                                key={book.title}
                                onClick={() => onClickGridItem(book.id)}
                            >
                                <img src={book.image} alt={book.title} style={{ width: 200, height: 200 }} />
                                <GridListTileBar
                                    title={book.title}
                                    subtitle={book.author && <span>by: {book.author}</span>}
                                />
                            </GridListTile>
                        ))}
                    </div>
                    <div>
                        <Pagination count={pageNum} page={page} onChange={handleChange} />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default BookDetailsComponent;