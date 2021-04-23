import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { getBooksByGenreUrl, getBooksBySearchUrl } from '../common/endpoints'
import Back from '../assets/Back.svg'
import Search from '../assets/Search.svg'
import axios from 'axios';
import { useHistory, useParams } from 'react-router';

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
    }
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

export default function BookDetailsComponent() {
    const classes = useStyles();
    const colCount = getColLength();
    let [pageNum, setPageNum] = useState(1);
    let [booksList, setBooksList] = useState([]);

    const params = useParams();
    let category = params.name;

    let history = useHistory();

    const BookFormatLevel = [
        "text/html",
        "application/pdf",
        "text/plain; charset=utf-8:"
    ];

    useEffect(() => {
        getData(category, pageNum)
    })

    const getData = (category, load) => {
        if (load) {
            axios.get(getBooksByGenreUrl(category, pageNum))
                .then(res => {
                    setBooksList(res.data.results)
                })
                .catch(err => {
                    console.log(err.response);
                })
        }
    };

    const goBack = () => {
        history.goBack()
    }

    const onClickGridItem = (id) => {
        let formats;
        booksList.forEach(book => {
            if (book.id === id) {
                formats = book.formats;
            }
        })
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

    return (
        <div className={classes.root}>
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
                        {/* <img src={Back} /><span className="bookslist_category_name">{category}</span> */}
                        {/* <div class="aligned"> */}
                        <img src={Back} onClick={goBack} style={{ width: "50", top: '10' }} alt="" />
                        <span className="text-color"
                            style={{ fontFamily: 'Montserrat-Regular', fontSize: '25px', padding: '1%', fontWeight: 'bold' }}>
                            {category}
                        </span>
                        {/* </div> */}
                    </ListSubheader>
                </GridListTile>
                {booksList.map(tile => (
                    <GridListTile
                        onClick={() => onClickGridItem(tile.id)}
                        className={classes.gridListItem}
                        key={tile.title}
                    >
                        <img src={tile.formats['image/jpeg']} alt={tile.title} />
                        <GridListTileBar
                            title={tile.title}
                            subtitle={tile.authors[0] && tile.authors[0].name && <span>by: {tile.authors[0].name}</span>}
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

