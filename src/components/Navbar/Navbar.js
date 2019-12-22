import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    navbar: {
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'flex-start',
        margin: '1rem',
        marginBottom: '0px'
    },
    header: {
        color: 'white',
        margin: '0px',
        marginLeft: 'auto'
    },
    inline: {
        display: 'inline'
    }
})

class Navbar extends Component{

    backToList = () => {
        this.props.history.push(`/`);
    }

    render(){
        const classes = this.props.classes;
        if(this.props.match.isExact === false){
            let currentlyShowing;
            if(this.props.currentDisplay !== ''){
                currentlyShowing = (
                    <h2 className={`${classes.header} ${classes.inline}`} >
                        {this.props.currentDisplay} Movies
                    </h2>
                );
            } else {
                currentlyShowing = <></>;
            }
            return(
                <div className={classes.navbar}>
                    <nav className={classes.inline}>
                        <Button variant="contained"
                        onClick={this.backToList}>
                            Back to Movie List
                        </Button>
                    </nav>
                    {currentlyShowing}
                </div>
            );
        } else {
            return <nav></nav>
        }
    }
}

export default withStyles(styles)(
    withRouter(connect((r)=>({currentDisplay: r.display}))(Navbar))
);