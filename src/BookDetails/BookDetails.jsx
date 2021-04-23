import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { getBooksByGenreUrl, getBooksBySearchUrl } from '../common/endpoints'
import Back from '../assets/Back.svg'
import SearchIcon from "@material-ui/icons/Search";
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper
    },
    gridList: {
        width: "100%",
        height: "100%"
    },
    gridListItem: {
        padding: '2%',
        cursor: "pointer"
    },
    search: {
        display: 'flex'
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
    const [isLoading, ssetIsLoading] = useState(false)

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
                    console.log(err.response);
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

        <ul id='list'>
            <div className={classes.root} >
                <GridList
                    cols={colCount}
                    cellHeight={240}
                    spacing={5}
                    className={classes.gridList}
                >
                    <GridListTile
                        key="Subheader"
                        cols={colCount}
                        style={{ height: "auto" }}
                    >
                        <ListSubheader component="div">
                            <img src={Back} onClick={goBack} style={{ width: "50", top: '10', cursor: 'pointer' }} alt="" />
                            <span className="text-color"
                                style={{ fontFamily: 'Montserrat-Regular', fontSize: '25px', padding: '1%', fontWeight: 'bold' }}>
                                {category}
                            </span>
                        </ListSubheader>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}  >
                                <SearchIcon />
                            </div>
                            <div>
                                <input placeholder="Search Books…"
                                    value={searchWord}
                                    onChange={(e) => { setSearchWord(e.target.value) }}
                                    onKeyDown={getBooksBySearch}
                                />
                            </div>
                        </div>
                    </GridListTile>
                    {filteredList && filteredList.map(tile => (
                        <GridListTile
                            className="booksList"
                            onClick={() => onClickGridItem(tile.id)}
                            className={classes.gridListItem}
                            key={tile.id}
                        >
                            <img src={tile.formats['image/jpeg']} alt={tile.title} />
                            <GridListTileBar
                                title={tile.title}
                                subtitle={tile.authors[0] && tile.authors[0].name && <span>by: {tile.authors[0].name}</span>}
                            />
                        </GridListTile>
                    ))}
                    {filteredList.length && !isLoading === 0 ? <div>There are no books with the specified name!</div> : null}
                    {isLoading ? <div><CircularProgress /> </div> : null}
                </GridList>
            </div>
        </ul>
    );
}

export default BookDetailsComponent