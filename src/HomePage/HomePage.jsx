import './HomePage.css'
import React from 'react';
import Pattern from '../assets/Pattern.svg'
import Next from '../assets/Next.svg'
import Fiction from '../assets/Fiction.svg'
import Drama from '../assets/Drama.svg'
import Humour from '../assets/Humour.svg'
import Politics from '../assets/Politics.svg'
import Philosophy from '../assets/Philosophy.svg'
import HistoryImg from '../assets/History.svg'
import Adventure from '../assets/Adventure.svg'
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '40px'
    },
}));

const HomePageComponent = () => {

    const classes = useStyles();

    let categories = [
        { id: 1, categoryName: 'Fiction', categoryImage: Fiction },
        { id: 2, categoryName: 'Drama', categoryImage: Drama },
        { id: 3, categoryName: 'Humour', categoryImage: Humour },
        { id: 4, categoryName: 'Politics', categoryImage: Politics },
        { id: 5, categoryName: 'Philosophy', categoryImage: Philosophy },
        { id: 6, categoryName: 'History', categoryImage: HistoryImg },
        { id: 7, categoryName: 'Adventure', categoryImage: Adventure },
    ]

    return (
        <div className="homepage_component">
            <div className="homepage_component_container" >
                <div style={{ backgroundImage: `url(${Pattern})` }} >
                    <h1 className="title title-size text-color" >Gutenberg Project</h1>
                    <div>
                        <p className="title">A social cataloging website that allows you to freely search its database of books, annotations, and reviews.</p>
                    </div>
                </div>
                <div className="homepage_component_genred">
                    <Grid container spacing={3}>
                        {categories.map(category =>
                            <Grid item xs={12} sm={6} key={category.id} >
                                <Link to={`/category/${category.categoryName}`} >
                                    <Paper className={classes.paper}>
                                        <img className="category_image" src={category.categoryImage} alt={category.categoryImage} style={{ width: 50, height: 35 }} />
                                        <p className="category_name">{category.categoryName.toUpperCase()}</p>

                                        <img className="category_next" src={Next} alt='next' style={{ width: 25, height: 25 }} />

                                    </Paper>
                                </Link>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default HomePageComponent;