import React from 'react';
import Input from '@material-ui/core/Input';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    // marginRight: theme.spacing.unit * 2,
    // marginLeft: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '0.5%',
    marginBottom: '0.5%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 5,
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    height: '100%'
  },
  inputInput: {
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  }
});

class SearchBox extends React.Component {
  constructor() {
    super();
    this.state = {
      searchText: null
    };
  }

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleSearchText = event => {
    this.setState({ searchText: event.target.value });
    console.log(this.state.searchText);
  };

  handleSubmitSearch = () => {
    console.log(this.props.history);
    this.props.history.push('/search');
  };

  handleSearchKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleSubmitSearch();
      event.preventDefault();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <Input
          placeholder='Search…'
          disableUnderline
          onChange={this.handleSearchText}
          onSubmit={this.handleSubmitSearch}
          onKeyPress={this.handleSearchKeyPress}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
        />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(SearchBox));
