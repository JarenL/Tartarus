import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import CreatePostDialog from '../Buttons/ButtonDialogs/CreatePostDialog'
import CreateCommentDialog from '../Buttons/ButtonDialogs/CreateCommentDialog'
import { connect } from 'react-redux';
import UserMenu from '../Views/User/UserMenu';
import { Link } from 'react-router-dom';
import { updateForum, setDrawerState } from '../../redux/actions/actions'
import SubscribeButton from '../Buttons/SubscribeButton'
import UnsubscribeButton from '../Buttons/UnsubscribeButton';
import { withRouter } from "react-router";
import CreatePost from '../Buttons/CreatePost/CreatePost';
import CreateComment from '../Buttons/CreateComment/CreateComment'

const styles = theme => ({
  root: {
    width: '100%',
    position: 'fixed',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    fontSize: "20px",
    paddingRight: "20px",
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class PrimarySearchAppBar extends React.Component {
  constructor() {
    super()
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      currentPage: null,
      searchText: null
    }
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    this.props.dispatch(setDrawerState());
  };

  changeForum = (forum) => {
    console.log("forum clicked")
    this.props.dispatch(updateForum(forum))
  }

  componentDidMount = () => {
    this.setState({
      currentPage: this.props.currentPage
    })
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.currentPage !== this.props.currentPage) {
      this.setState({
        currentPage: newProps.currentPage.currentPage
      })
    }
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

	handleSearchText = (event) => {
    this.setState({ searchText: event.target.value });
    console.log(this.state.searchText)
  }
  
	handleSubmitSearch = () => {
    console.log(this.state.searchText)
    console.log(this.props)
    this.props.history.replace('search');

  }
  
  handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmitSearch();
      event.preventDefault();
    }
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleClose}>My account</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge className={classes.margin} badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge className={classes.margin} badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    const createButtonSwitch = () => {
      switch (this.state.currentPage) {
        case 'Frontpage':
          return null;
        case 'Forum':
          return <CreatePost/>;
        case 'Post':
          return <CreateComment/>;
        case 'Comment':
          return <CreateComment/>;
        default:
          return null;
      }
    }

    const subscribeButtonSwitch = () => {
      if (this.state.currentPage !== 'Forum') {
        return null
      } else {
        if (this.props.currentForumAddress) {
          var index = this.props.userSettings[this.props.currentUserAddress].subscriptions.findIndex( forum => forum.address === this.props.currentForumAddress )
          if (index === -1) {
            return <SubscribeButton forumContext={this.props.currentForumAddress} />;
          } else {
            return <UnsubscribeButton forumContext={this.props.currentForumAddress} />;
          }
        } else {
          return null
        }
      } 
    }

    return (
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              onClick={this.handleDrawerToggle}
              color="inherit" aria-label="Open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" style={{ textDecoration: 'none', color: "white" }}>
              <div onClick={() => this.changeForum({ name: "Frontpage", address: null })}>
                <Typography className={classes.title} color="inherit" noWrap>
                  tartarus
                      </Typography>
              </div>
            </Link>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Input
                placeholder="Search…"
                disableUnderline
                onChange={this.handleSearchText}
                onSubmit={this.handleSubmitSearch}
                onKeyPress={this.handleSearchKeyPress}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {subscribeButtonSwitch()}
              {createButtonSwitch()}
              <UserMenu />
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentPage: state.page,
    currentForumAddress: state.forum.currentForumAddress,
    userSettings: state.accounts.userSettings,
    currentUserAddress: state.accounts.currentUserAddress,
    drawerState: state.drawerState
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(PrimarySearchAppBar)));