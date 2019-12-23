const EditPageStyle = theme => ({
    editCard: {
        color: 'white',
        margin: '1rem',
        textAlign: 'center'
    },
    dangerButton: {
        margin: "0.5rem",
        backgroundColor: '#664444',
        color: 'white',
        '&:hover':{
            backgroundColor: '#885555'
        }
    },
    buttonIcon: {
        margin: '0px',
        marginLeft: '0.5rem'
    }, 
    saveButton: {
        margin: '1rem',
        color: 'white',
        backgroundColor: '#557755',
        '&:hover': {
            backgroundColor: '#559055'
        }
    },
    cancelButton: {
        color: 'white',
        margin: '1rem',
        backgroundColor: '#664444',
        '&:hover':{
            backgroundColor: '#885555'
        }
    },
    white: {
        color: 'white',
        borderColor: 'white'
    },
    largeFont: {
        fontSize: '1.5rem'
    },
    selectGenre: {
        height: '100%',
        borderColor: 'white',
        color: 'white',
        minWidth: '9rem',
        margin: '0.5rem',
        marginTop: '0.65rem'
    },
    addGenreSection: {
        display: 'inline-block'
    },
    modalDiv: {
        position: 'absolute',
        width: '85vw',
        backgroundColor: '#222222',
        color: 'white',
        borderRadius: '5px'
    },
    modal: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    modalTextField: {
        textAlign: 'center',
        color: 'white',
        borderColor: 'white'
    },
    modalButtonsDiv: {
        display: 'flex',
        flexFlow: 'reverse-row wrap'
    }
});

export default EditPageStyle;