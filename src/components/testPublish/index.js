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
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { Preview, PublishButton, HelpText } from './components'
import Modal from './Modal'
import Post from './Post'
import styles from './styles'

const { fileToTypedArray, clearDataTransfer, isMagnet, isIpfsHash, formatBytes } = require('./util')
const services = require('./services')

class Publish extends React.Component {
  state = {
    isDragging: false,
    isPreviewing: false,
    comment: '',
    title: '',
    link: null,
    submitLink: '',
    errorMessage: null,
    publishButtonIsLoading: false,
    value: 'text',

  }

  constructor(props) {
    super(props)
    this.handleGlobalClipboardPasting = this.handleGlobalClipboardPasting.bind(this)
  }

  componentDidMount = () => {
    this.addGlobalClipboardPastingListener()
  }

  componentDidUpdate = (prevProps) => {
  }

  componentWillUnmount = () => {
    this.removeGlobalClipboardPastingListener()
  }

  addGlobalClipboardPastingListener = () => {
    document.querySelector('body').addEventListener('paste', this.handleGlobalClipboardPasting)
  }

  removeGlobalClipboardPastingListener = () => {
    document.querySelector('body').removeEventListener('paste', this.handleGlobalClipboardPasting)
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
    // const settings = await services.getSettings()

    this.setState({ isDragging: false, isPreviewing: true, link: `ipfs:${ipfsHash}` })
  }

  handleLinkPaste = async (e) => {
    const pastedValue = e.clipboardData.getData('text/plain')

    let link = pastedValue.trim()

    if (isIpfsHash(link)) {
      link = 'ipfs:' + link
    }

    console.log(link)

    // const settings = await services.getSettings()

    this.setState({ isPreviewing: true, link: link })
  }

  handleGlobalClipboardPasting = (e) => {
    if (e.path[0].tagName !== 'TEXTAREA') {
      this.handleLinkPaste(e)
    }
  }

  blockRegularTypingInLinkInput = ({ target }) => {
    target.innerHTML = dangerouslySetUploadMessage
  }

  cancelPostPreview = () => {
    this.setState({ isPreviewing: false })
  }

  handleCommentChange = ({ target }) => {
    console.log(this.state.comment)
    this.setState({ comment: target.value })
  }

  handleTitleChange = ({ target }) => {
    console.log(this.state.title)
    this.setState({ title: target.value })
  }

  handleLinkChange = ({ target }) => {
    console.log(this.state.submitLink)
    this.setState({ submitLink: target.value })
  }

  handleModalClose = () => {
    this.setState({ errorMessage: null })
    this.setState({ title: null })
    this.setState({ submitLink: null })
    this.setState({ value: "text" })
    this.setState({ comment: null })

  }

  // isDragging: false,
  // isPreviewing: false,
  // comment: '',
  // title: '',
  // link: null,
  // submitLink: '',
  // errorMessage: null,
  // publishButtonIsLoading: false,
  // value: 'text',


  handlePublish = async () => {
    let { comment, link } = this.state
    const { classes, profile } = this.props
    this.setState({ errorMessage: null })

    // handle errors
    if (!comment && !link) {
      this.setState({ errorMessage: <Typography variant='body1'>Cannot publish empty posts. <a href='https://subby.io/publish'>Need help?</a></Typography> })
      return
    }
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { classes, address, profile } = this.props
    const { isDragging, isPreviewing, comment, title, link, submitLink, errorMessage, settings, publishButtonIsLoading } = this.state

    const post = {
      comment,
      title,
      link,
      submitLink,
      username: "test",
      address,
      id: 0
    }

    const textTitleModal =         
      <TextField
        label="Title"
        className={classes.titleTextField}
        fullWidth
        rows={2}
        multiline
        placeholder={`Title`}
        value={title}
        onChange={this.handleTitleChange.bind(this)}
      />
    const textContentModal = 
      <TextField
        label="Content"
        className={classes.textField}
        fullWidth
        rows={5}
        multiline
        placeholder={`Post Text`}
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
      value={submitLink}
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
      onPaste={this.handleLinkPaste.bind(this)}
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
      content = textContentModal
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
        {isPreviewing &&
          <Preview>
            <Post post={post} settings={settings} preview onPostChange={this.handlePostChange} onPreviewClose={this.cancelPostPreview.bind(this)} />
          </Preview>
        }
                {publishTitle}
        {content}
        {upload}
        {linkText}

        <FormControl component="fieldset">
          <RadioGroup
            style={{ display: 'flex' }}
            aria-label="position"
            name="position"
            value={this.state.value}
            onChange={this.handleChange}
            row
          >
            <FormControlLabel
              value="text"
              control={<Radio color="secondary" />}
              label="Text"
              labelPlacement="top"
            />
            <FormControlLabel
              value="link"
              control={<Radio color="secondary" />}
              label="Link"
              labelPlacement="top"
            />
            <FormControlLabel
              value="upload"
              control={<Radio color="secondary" />}
              label="Upload"
              labelPlacement="top"
            />
          </RadioGroup>
        </FormControl>

        <div className={classes.buttonsContainer}>

          <Tooltip title={<HelpText />} placement='top-start'>
            <HelpIcon className={classes.greyIcon} />
          </Tooltip>

          <span className={classes.errorMessage}>
            {errorMessage}
          </span>

          <Button
            variant='contained'
            color='default'
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

const dangerouslySetUploadMessage = 'Drop an image, torrent or paste a link'

Publish.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  // profile: state.app.profile,
  // address: state.app.address
})

const enhance = compose(
  connect(mapStateToProps),
  withStyles(styles)
)

export default enhance(Publish) // eslint-disable-line
