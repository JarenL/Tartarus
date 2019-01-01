import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/Done'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import MarkdownTextBox from "../MarkdownTextBox";
import TartarusContract from '../../../contracts/Tartarus.json';

import HelpText from './HelpText'
import CreateCommentButton from '../CreateCommentButton'
import Modal from '../Modal'
import styles from './styles'
import 'react-mde/lib/styles/css/react-mde-all.css';

const services = require('../../../services')

class CreateComment extends Component {
	constructor(props) {
		super(props)

		this.state = {
			comment: '',
			errorMessage: null
		}
	}

  handleCommentChange = ( value ) => {
    console.log(value)
    this.setState({ comment: value })
  }

  handlePublish = async () => {
    this.setState({ errorMessage: null })
    if (this.state.comment) {
        let commentObject = { comment : this.state.comment }
        console.log(commentObject)
				const ipfsHash = await services.ipfs.uploadObject(commentObject)
				console.log(ipfsHash)
        this.submitCommentTransaction(ipfsHash)
    } else {
			this.setState({ 
				errorMessage: <Typography variant='body1'>Cannot submit empty comments.</Typography> 
			})
		}
  }

  submitCommentTransaction = (ipfsHash) => {
    const contract = require('truffle-contract')
    const tartarus = contract(TartarusContract)
    tartarus.setProvider(this.props.web3.currentProvider)
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then((instance) => {
        console.log(ipfsHash)
				instance.createComment(
					this.props.currentForumAddress,
					this.props.currentPostAddress,
					this.props.currentPostAddress,
					ipfsHash,
					{ from: accounts[0], gasPrice: 20000000000 }
				)
      })
    })
  }

  render() {
		const { classes, address, profile } = this.props
    return (
      <Modal onClose={this.handleModalClose} trigger={<CreateCommentButton />} title="hello">
				<MarkdownTextBox handleChange={this.handleCommentChange.bind(this)}/>
        <div className={classes.buttonsContainer}>

          <Tooltip title={<HelpText />} placement='top-start'>
            <HelpIcon className={classes.greyIcon} />
          </Tooltip>

          <span className={classes.errorMessage}>
            {this.state.errorMessage}
          </span>

          <Button
            variant='contained'
            color='secondary'
            className={classes.publishButton}
            onClick={this.handlePublish.bind(this)}
          >
            <span className={classes.publishButtonText}>Submit</span>
            {<CheckIcon className={classes.rightIcon} />}
            {<span className={classes.rightIcon}></span>}
          </Button>
        </div>
      </Modal>
    )
  }
}

CreateComment.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  // profile: state.app.profile,
  // address: state.app.address
	web3: state.web3,
	tartarusAddress: state.tartarus.tartarusAddress,
	accounts: state.accounts,
	currentForum: state.forum.currentForum,
	currentForumAddress: state.forum.currentForumAddress,
	currentPostAddress: state.forum.currentPostAddress
})

const enhance = compose(
  connect(mapStateToProps),
  withStyles(styles)
)

export default enhance(CreateComment) // eslint-disable-line
