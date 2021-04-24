import './BookDetails.css'
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import { getBooksByGenreUrl, getBooksBySearchUrl } from '../common/endpoints'
import Back from '../assets/Back.svg'
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    gridList: {
        width: "100%",
        height: "100%"
    },
    gridListItem: {
        padding: '2%',
        cursor: "pointer"
    },
    search: {
        display: 'flex',
    },
}));

const getColLength = () => {
    const xs = window.matchMedia("(max-width:767px)");
    const sm = window.matchMedia("(max-width:991px) and (min-width:768px)");
    const md = window.matchMedia("(max-width:1199px) and (min-width:992px)");
    const lg = window.matchMedia("(min-width:1200px)");
    if (xs.matches) {
        return 2;
    } else if (sm.matches) {
        return 4;
    } else if (md.matches) {
        return 6;
    } else if (lg.matches) {
        return 5;
    }
};

function BookDetailsComponent(props) {

    const classes = useStyles();
    const colCount = getColLength();
    let [pageNum, setPageNum] = useState(1);
    let [booksList, setBooksList] = useState([]);
    let [filteredList, setFilteredList] = useState(booksList)
    const [searchWord, setSearchWord] = useState('');
    const [loadMore, setLoadMore] = useState(true);
    // const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [isLoading, ssetIsLoading] = useState(false);
    const [error, setError] = useState('')

    const params = useParams();
    let category = params.name;

    let history = useHistory();

    const BookFormatLevel = [
        "text/html",
        "application/pdf",
        "text/plain; charset=utf-8:"
    ];



    const goBack = () => {
        history.goBack()
    }

    const onClickGridItem = (id) => {
        let formats;
        if (filteredList) {
            filteredList.forEach(book => {
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

    const getBooksBySearch = (e) => {
        if (e.keyCode === 13) {
            fetchBooksBySearch()
        }
    }

    const fetchBooksBySearch = () => {
        ssetIsLoading(true)
        axios.get(getBooksBySearchUrl(searchWord, category)).then(res => {
            setFilteredList(res.data.results)
            ssetIsLoading(false)
        }).catch(err => {
            console.log(err);
        })
    }

    const clearSearch = () => {
        setSearchWord('');
        setBooksList([])
        getData(category, true)
    }

    const getData = useCallback((category, load) => {
        ssetIsLoading(true)
        if (load) {
            axios.get(getBooksByGenreUrl(category, pageNum))
                .then(res => {
                    setBooksList([...booksList, ...res.data.results]);
                    setFilteredList([...booksList, ...res.data.results])
                    console.log(pageNum);
                    setPageNum(pageNum + 1)
                    setLoadMore(false);
                    ssetIsLoading(false);
                })
                .catch(err => {
                    setLoadMore(false);
                    setError(err.response.status)
                    // ssetIsLoading(false)
                })
        }
    }, [loadMore]);

    useEffect(() => {
        getData(category, loadMore);
        setLoadMore(false);
    }, [loadMore, category, getData]);

    useEffect(() => {
        const list = document.getElementById('list')
        if (props.scrollable) {
            // list has fixed height
            list.addEventListener('scroll', (e) => {
                const el = e.target;
                if (el.scrollTop + el.clientHeight === el.scrollHeight) {
                    setLoadMore(true);
                }
            });
        } else {
            // list has auto height  
            window.addEventListener('scroll', () => {
                if (window.scrollY + window.innerHeight === list.clientHeight + list.offsetTop) {
                    setLoadMore(true);
                }
            });
        }
    }, [props.scrollable]);

    useEffect(() => {
        const list = document.getElementById('list');

        if (list.clientHeight <= window.innerHeight && list.clientHeight) {
            setLoadMore(true);
        }
    }, [booksList]);




    return (
        <React.Fragment>
            <Grid item xs={12} style={{ padding: '3%' }}>
                <GridList
                    cols={colCount}
                    cellHeight={100}
                    spacing={5}
                >
                    <GridListTile
                        key="Subheader"
                        cols={colCount}
                    >
                        <ListSubheader component="div">
                            <img src={Back} onClick={goBack} style={{ width: "50", top: '10', cursor: 'pointer' }} alt="" />
                            <span className="text-color"
                                style={{ fontFamily: 'Montserrat-Regular', fontSize: '25px', padding: '1%', fontWeight: 'bold' }}>
                                {category}
                            </span>
                        </ListSubheader>
                        <div className={classes.search}>
                            <div className="input-container">
                                <i className="fa fa-search icon"></i>
                                <input
                                    type="text" className="search" placeholder="Search Books…"
                                    value={searchWord}
                                    onChange={(e) => { setSearchWord(e.target.value) }}
                                    onKeyDown={getBooksBySearch}
                                />
                                {searchWord !== '' ? <i className="fa fa-remove icon icon-remove" onClick={clearSearch} ></i> : null}
                            </div>
                        </div>
                    </GridListTile>
                </GridList>
            </Grid>
            <ul id='list'>
                <Grid item xs={12}>
                    <div className="showslist" >
                        {filteredList && filteredList.map(book =>
                            <div key={book.id} className="show_card" onClick={() => onClickGridItem(book.id)} >
                                <img className="showslist_image" src={book.formats['image/jpeg']} alt={book.title} style={{ width: 200, height: 200 }} />
                                <p className="showlist_name" >{book.title.length > 50 ? <React.Fragment>{book.title.toUpperCase().slice(0, 50)}...</React.Fragment> : book.title.toUpperCase()}</p>
                                <p className="author" >{book.authors && book.authors[0] && book.authors[0]['name']}</p>
                            </div>
                        )}
                        <div>
                            {filteredList.length === 0 && searchWord.length > 0 ? <div>There are no books with the specified name!</div> : null}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }} >
                        {isLoading && error === '' ? <div><CircularProgress /> </div> : null}
                    </div>
                </Grid>
            </ul>
        </React.Fragment>
    );
}

export default BookDetailsComponent