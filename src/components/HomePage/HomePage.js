import './HomePage.css'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Next from '../../assets/images/Next.svg'
import Fiction from '../../assets/images/Fiction.svg'
import Drama from '../../assets/images/Drama.svg'
import Humour from '../../assets/images/Humour.svg'
import Politics from '../../assets/images/Politics.svg'
import Philosophy from '../../assets/images/Philosophy.svg'
import HistoryImg from '../../assets/images/History.svg'
import Adventure from '../../assets/images/Adventure.svg'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
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
        // <div className="home_page_component" >
        //     <div>
        //         <Grid container spacing={3}>
        //             <div>
        //                 <Grid item xs={12}>
        //                     <div>
        //                         <h1 className="hpc_header">Gutenberg</h1>
        //                         <div>
        //                             <p className="hpc_subtitle">A social cataloging website that allows you to freely search its database of books, annotations, and reviews.</p>
        //                         </div>
        //                     </div>
        //                 </Grid>
        //             </div>
        //             <div className="hpc_genres">
        //                 <Grid container spacing={3}>
        //                     {categories.map(category =>
        //                         <Grid item xs={12} sm={6} key={category.id} >
        //                             <Link to={`/category/${category.categoryName}`} >
        //                                 <Paper className={classes.paper}>
        //                                     <img className="genre_image" src={category.categoryImage} alt={category.categoryImage} style={{ width: 50, height: 35 }} />
        //                                     <p className="genre_name">{category.categoryName.toUpperCase()}</p>
        //                                     <img className="genre_next" src={Next} alt='next' style={{ width: 25, height: 25 }} />

        //                                 </Paper>
        //                             </Link>
        //                         </Grid>
        //                     )}
        //                 </Grid>
        //             </div>
        //         </Grid>
        //     </div>

        // </div>
        <div className="homepage_component">
            <div className="homepage_component_container" >
                <div>
                    <h1 className="hpc_header" >Gutenberg Project</h1>
                    <div>
                        <p className="hpc_subtitle">A social cataloging website that allows you to freely search its database of books, annotations, and reviews.</p>
                    </div>
                </div>
                <div className="homepage_component_genred">
                    <Grid container spacing={3}>
                        {categories.map(category =>
                            <Grid item xs={12} sm={6} key={category.id} >
                                <Link to={`/category/${category.categoryName}`} >
                                    <Paper className={classes.paper}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={4}>
                                                <img src={category.categoryImage} alt={category.categoryImage} style={{ width: 50, height: 35 }} />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <p>{category.categoryName.toUpperCase()}</p>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <img src={Next} alt='next' style={{ width: 25, height: 25 }} />
                                            </Grid>
                                        </Grid>
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