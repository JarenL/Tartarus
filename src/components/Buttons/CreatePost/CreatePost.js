import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import LinkIcon from '@material-ui/icons/Link'
import UploadIcon from '@material-ui/icons/InsertPhoto'
import TextIcon from '@material-ui/icons/Message';

import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckIcon from '@material-ui/icons/Done'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import SnackBar from './testSnackBar'

import TartarusContract from '../../../contracts/Tartarus.json';
import { HelpText } from './components'
import MarkDownTextBox from '../MarkdownTextBox'
import CreatePostButton from '../CreatePostButton'
import Loading from '../../Loading'
import Modal from '../Modal'
import styles from './styles'
import 'react-mde/lib/styles/css/react-mde-all.css';

const { fileToTypedArray, clearDataTransfer, isIpfsHash, formatBytes, stringToIpfsBuffer } = require('./util')
const services = require('../../../services')

class CreatePost extends React.Component {
  state = {
    isDragging: false,
    isPreviewing: false,
    snackBarOpen: false,
    title: '',
    post: '',
    link: '',
    upload: '',
    titleIpfsHash: null,
    postIpfsHash: null,
    linkIpfsHash: null,
    uploadIpfsHash: null,
    uploadLoading: false,
    errorMessage: null,
    value: 'text'
  }
  
  handleSnackBarOpen = () => {
    this.setState({ snackBarOpen: true });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackBarOpen: false });
  };

  handleUploadDragEnter = (e) => {
    e.preventDefault()
    this.setState({ isDragging: true })
  }

  handleUploadDragOver = (e) => {
    e.preventDefault()
  }

  handleUploadDragLeave = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({ isDragging: false })
  }

  handleUploadDrop = async (e) => {
    e.preventDefault()

    this.setState({ isDragging: false, isPreviewing: true, upload: 'loading:Uploading' })

    const { dataTransfer } = e
    const file = dataTransfer.items[0].getAsFile()
    await this.handleIpfsFile(file)
    clearDataTransfer(dataTransfer)
  }

  handleIpfsFile = async (file) => {
    this.setState({
      uploadLoading : true
    })
    const typedArray = await fileToTypedArray(file)
    const ipfsHash = await services.ipfs.uploadTypedArray(typedArray)
    this.setState({ isDragging: false, isPreviewing: true, uploadLoading: false, uploadSuccess: true, uploadIpfsHash: ipfsHash })
    console.log(this.state.link)
  }

  blockRegularTypingInUploadInput = ({ target }) => {
    target.innerHTML = dangerouslySetUploadMessage
  }

  cancelPostPreview = () => {
    this.setState({ isPreviewing: false })
  }

  handlePostChange = ( value ) => {
    console.log(value)
    this.setState({ post: value })
  }

  handleTitleChange = ({ target }) => {
    console.log(this.state.title)
    this.setState({ title: target.value })
  }

  handleLinkChange = ({ target }) => {
    console.log(this.state.url)
    this.setState({ url: target.value })
  }

  handleModalClose = () => {
    this.setState({ 
      errorMessage: null,
      title: '',
      uploadIpfsHash: null,
      post: '',
      link: '',
      value: "text"
    })
  }

  handleChange = event => {
    this.setState({ 
      value: event.target.value,
      errorMessage: null,
      title: '',
      uploadIpfsHash: null,
      post: '',
      link: ''
    });
    console.log(this.state.title)
  };

  handlePublish = async () => {
    let { post, link, title, uploadIpfsHash, value } = this.state
    this.setState({ errorMessage: null })

    if (value === "text") {
      if (title && post) {
        let postObject = {title : title, post : post }
        console.log(postObject)
        const ipfsHash = await services.ipfs.uploadObject(postObject)
        this.submitPostTransaction(ipfsHash)
      } else {
        this.setState({ errorMessage: <Typography variant='body1'>Cannot submit empty posts.</Typography> })
        return
      }
    }
    
    if (value === "link") {
      if (title && link) {
        let postObject = {title : title, post : link }
        const ipfsHash = await services.ipfs.uploadObject(postObject)
        this.submitPostTransaction(ipfsHash)
      } else {
        this.setState({ errorMessage: <Typography variant='body1'>Cannot submit empty posts.</Typography> })
        return
      }
    }

    if (value === "upload") {
      if (title && uploadIpfsHash) {
        let postObject = {title : title, post : uploadIpfsHash }
        console.log(postObject)
        const ipfsHash = await services.ipfs.uploadObject(postObject)
        this.submitPostTransaction(ipfsHash)
      } else {
        this.setState({ errorMessage: <Typography variant='body1'>Cannot submit empty posts.</Typography> })
        return
      }
    }
  }

  submitPostTransaction = (ipfsHash) => {
    const contract = require('truffle-contract')
    const tartarus = contract(TartarusContract)
    tartarus.setProvider(this.props.web3.currentProvider)
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then((instance) => {
        console.log(ipfsHash)
        instance.createPost(
          this.props.currentForumAddress,
          ipfsHash,
          { from: accounts[0], gasPrice: 20000000000 }
        )
      }).then((error, result) => {
        if (error) {

        } else {
          this.handleSnackBarOpen()
        }
      })
    })
  }

  render() {
    const { classes, address, profile } = this.props
    const { isDragging, isPreviewing, comment, title, link, uploadIpfsHash, errorMessage, settings, publishButtonIsLoading } = this.state

    const textTitleModal =         
      <TextField
        id="title"
        label="Title"
        className={classes.titleTextField}
        fullWidth
        rows={2}
        multiline
        placeholder={"Title..."}
        value={title}
        onChange={this.handleTitleChange.bind(this)}
      />

    const linkModal = 
    <TextField
      label="Link"
      className={classes.textField}
      fullWidth
      rows={2}
      multiline
      placeholder={`Link`}
      value={link}
      onChange={this.handleLinkChange.bind(this)}
    />

    const uploadModal =           
    <Typography
      className={
        classnames(
          classes.upload,
          !isDragging && classes.uploadNotDragging,
          isDragging && classes.uploadDragging
        )
      }
      onDragEnter={this.handleUploadDragEnter.bind(this)}
      onDragOver={this.handleUploadDragOver.bind(this)}
      onDragLeave={this.handleUploadDragLeave.bind(this)}
      onDrop={this.handleUploadDrop.bind(this)}
      contentEditable
      suppressContentEditableWarning
      variant='title'
      component='div'
      onInput={this.blockRegularTypingInUploadInput.bind(this)}
      >
      {dangerouslySetUploadMessage}
    </Typography>

    let postTitle = null
    let postText = null
    let postUpload = null
    let postLink = null
    console.log(this.state.value)
    if (this.state.value === "text") {
      postTitle = textTitleModal
      postText = <MarkDownTextBox handleChange={this.handlePostChange.bind(this)}/>
    }

    if ( this.state.value === "link") {
      postTitle = textTitleModal
      postLink = linkModal
    }

    if (this.state.value === "upload") {
      postTitle = textTitleModal
      if (this.state.uploadLoading) {
        postUpload = <Loading/>
      } else {
        if (this.state.uploadSuccess) {
          postUpload = <CheckIcon/>
        } else {
          postUpload = uploadModal
        }
      }
    }

    return (
      <div>
        <Modal onClose={this.handleModalClose} trigger={<CreatePostButton />} title="hello">
        {postTitle}
        {postText}
        {postUpload}
        {postLink}

        <div>
          <RadioGroup
            style={{ display: 'flex' , justifyContent: 'center', alignItems: 'center'}}
            aria-label="position"
            name="position"
            value={this.state.value}
            onChange={this.handleChange}
            row
          >
            <FormControlLabel
              value="text"
              control={<Radio color="secondary" />}
              label={<TextIcon/>}
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="link"
              control={<Radio color="secondary" />}
              label={<LinkIcon/>}
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="upload"
              control={<Radio color="secondary" />}
              label={<UploadIcon/>}
              labelPlacement="bottom"
            />
          </RadioGroup>
        </div>

        <div className={classes.buttonsContainer}>
          <Tooltip title={<HelpText />} placement='top-start'>
            <HelpIcon className={classes.greyIcon} />
          </Tooltip>
          <span className={classes.errorMessage}>
            {errorMessage}
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
      <SnackBar open={this.state.snackBarOpen} handleClose={this.handleSnackBarClose}/>
      </div>
      
    )
  }
}

const dangerouslySetUploadMessage = 'Drop an image or video'

CreatePost.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  currentForumAddress: state.forum.currentForumAddress
})

const enhance = compose(
  connect(mapStateToProps),
  withStyles(styles)
)

export default enhance(CreatePost) // eslint-disable-line
