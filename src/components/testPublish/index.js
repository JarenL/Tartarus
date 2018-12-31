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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ReactMdeDemo } from "./ReactMdeDemo";
import 'react-mde/lib/styles/css/react-mde-all.css';
import TartarusContract from '../../contracts/Tartarus.json';


import { Preview, PublishButton, HelpText } from './components'
import Modal from './Modal'
import Post from './Post'
import styles from './styles'

const { fileToTypedArray, clearDataTransfer, isIpfsHash, formatBytes, stringToIpfsBuffer } = require('./util')
const services = require('./services')

class Publish extends React.Component {
  state = {
    isDragging: false,
    isPreviewing: false,
    comment: '',
    title: '',
    link: '',
    url: '',
    titleLink: '',
    urlLink: '',
    commentLink: '',
    submitLink: '',
    errorMessage: null,
    publishButtonIsLoading: false,
    value: 'text',

  }

  handleLinkDragEnter = (e) => {
    e.preventDefault()
    this.setState({ isDragging: true })
  }

  handleLinkDragOver = (e) => {
    e.preventDefault()
  }

  handleLinkDragLeave = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({ isDragging: false })
  }

  handleLinkDrop = async (e) => {
    e.preventDefault()

    this.setState({ isDragging: false, isPreviewing: true, link: 'loading:Uploading' })

    const { dataTransfer } = e
    const file = dataTransfer.items[0].getAsFile()
    await this.handleIpfsFile(file)
    clearDataTransfer(dataTransfer)
  }

  handleIpfsFile = async (file) => {
    const typedArray = await fileToTypedArray(file)
    console.log(typedArray)
    const ipfsHash = await services.ipfs.uploadTypedArray(typedArray)
    console.log(ipfsHash)

    this.setState({ isDragging: false, isPreviewing: true, link: ipfsHash })
    console.log(this.state.link)
  }

  handleIpfsText = async (text) => {
    const ipfsHash = await services.ipfs.uploadString(text)
    console.log(ipfsHash)

    this.setState({ isDragging: false, isPreviewing: true, link: `ipfs:${ipfsHash}` })
    console.log(this.state.link)
  }

  blockRegularTypingInLinkInput = ({ target }) => {
    target.innerHTML = dangerouslySetUploadMessage
  }

  cancelPostPreview = () => {
    this.setState({ isPreviewing: false })
  }

  handleCommentChange = ( value ) => {
    console.log(value)
    this.setState({ comment: value })
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
      url: '',
      comment: '',
      link: '',
      value: "text"
    })
  }

  handleChange = event => {
    this.setState({ 
      value: event.target.value,
      errorMessage: null,
      title: '',
      url: '',
      comment: '',
      link: ''
    });
    console.log(this.state.title)
  };

  handlePublish = async () => {
    let { comment, link, title, url, value } = this.state
    this.setState({ errorMessage: null })

    if (value === "text") {
      if (title && comment) {
        let postObject = {title : title, postContent : comment }
        console.log(postObject)
        const ipfsHash = await services.ipfs.uploadObject(postObject)
        this.submitPostTransaction(ipfsHash)
      } else {
        this.setState({ errorMessage: <Typography variant='body1'>Cannot submit empty posts.</Typography> })
        return
      }
    }
    
    if (value === "link") {
      if (title && url) {
        let postObject = {title : title, postContent : url }
        const ipfsHash = await services.ipfs.uploadObject(postObject)
        this.submitPostTransaction(ipfsHash)
      } else {
        this.setState({ errorMessage: <Typography variant='body1'>Cannot submit empty posts.</Typography> })
        return
      }
    }

    if (value === "upload") {
      if (title && link) {
        let postObject = {title : title, postContent : link }
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
      })
    })
  }

  render() {
    const { classes, address, profile } = this.props
    const { isDragging, isPreviewing, comment, title, link, url, errorMessage, settings, publishButtonIsLoading } = this.state

    const post = {
      comment,
      title,
      link,
      url,
      username: "test",
      address,
      id: 0
    }

    const textTitleModal =         
      <TextField
        id="title"
        label="Title"
        className={classes.titleTextField}
        fullWidth
        rows={2}
        multiline
        placeholder={"Title..."}
        value={this.state.title}
        onChange={this.handleTitleChange.bind(this)}
      />
    const textContentModal = 
      <TextField
        label="Text"
        className={classes.textField}
        fullWidth
        rows={5}
        multiline
        placeholder={"Text..."}
        value={comment}
        onChange={this.handleCommentChange.bind(this)}
      />

    const linkModal = 
    <TextField
      label="Link"
      className={classes.textField}
      fullWidth
      rows={2}
      multiline
      placeholder={`Link`}
      value={url}
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
      onDragEnter={this.handleLinkDragEnter.bind(this)}
      onDragOver={this.handleLinkDragOver.bind(this)}
      onDragLeave={this.handleLinkDragLeave.bind(this)}
      onDrop={this.handleLinkDrop.bind(this)}
      // onPaste={this.handleLinkPaste.bind(this)}
      contentEditable
      suppressContentEditableWarning
      variant='title'
      component='div'
      onInput={this.blockRegularTypingInLinkInput.bind(this)}
      >
      {dangerouslySetUploadMessage}
    </Typography>

    let publishTitle = null
    let content = null
    let upload = null
    let linkText = null
    if (this.state.value === "text") {
      publishTitle = textTitleModal
      content = <ReactMdeDemo handleChange={this.handleCommentChange.bind(this)}/>
    }

    if ( this.state.value === "link") {
      publishTitle = textTitleModal
      linkText = linkModal
    }

    if (this.state.value === "upload") {
      publishTitle = textTitleModal
      upload = uploadModal
    }

    return (
      <Modal onClose={this.handleModalClose} trigger={<PublishButton />} title="hello">
        {publishTitle}
        {content}
        {upload}
        {linkText}

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
            <span className={classes.publishButtonText}>Publish</span>
            {!publishButtonIsLoading && <CloudUploadIcon className={classes.rightIcon} />}
            {publishButtonIsLoading && <span className={classes.rightIcon}><span className={classes.publishButtonLoading}><CircularProgress className={classes.black} size={17} /></span></span>}
          </Button>
        </div>

      </Modal>
    )
  }
}

const dangerouslySetUploadMessage = 'Drop an image or video'

Publish.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  // profile: state.app.profile,
  // address: state.app.address
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  currentForumAddress: state.forum.currentForumAddress
})

const enhance = compose(
  connect(mapStateToProps),
  withStyles(styles)
)

export default enhance(Publish) // eslint-disable-line
