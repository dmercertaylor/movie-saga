const MovieCardStyle = theme => {
    const lighterGray = '#191919'
    return ({
    movieCard: {
        margin: '1rem',
        padding: '1.5rem',
        borderRadius: '10px',
        backgroundColor: '#222225',
        color: 'white',
        boxShadow: `5px 5px 10px ${lighterGray},
                    -5px 5px 10px ${lighterGray},
                    5px -5px 10px ${lighterGray},
                    -5px -5px 10px ${lighterGray}`
    },
    infoCard: {
        flexGrow: '2'
    },
    row: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlign: "left",
        width: '100%',
        '@media (max-width: 540px)': {
            flexFlow: "column nowrap",
            alignItems: "center",
            textAlign: "center"
        }
    },
    poster: {
        marginRight: '1rem',
    },
    button: {
        margin: "0.5rem",
        backgroundColor: '#444455',
        color: 'white',
        '&:hover':{
            backgroundColor: '#555566'
        }
    },
    detailsContainer: {
        margin: '0.5rem',
    }
});
}

export default MovieCardStyle;