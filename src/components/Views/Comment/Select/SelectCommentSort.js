import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {setCommentSortType} from '../../../../redux/actions/actions';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SelectCommentSort extends React.Component {
  state = {
    sortType: ''
  };

  componentDidMount() {
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.props.dispatch(setCommentSortType(event));
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="sortType-simple">Sort Type</InputLabel>
          <Select
            value={this.state.age}
            onChange={this.handleChange}
          > 
            <MenuItem value='oldest'>Oldest</MenuItem>
            <MenuItem value='newest'>Newest</MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

SelectCommentSort.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    sortType: state.sorting
  };
}
export default connect(mapStateToProps, null, null, {
  pure: false
})(withStyles(styles)(SelectCommentSort));

