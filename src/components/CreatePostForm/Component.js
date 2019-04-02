import React from 'react';
import { Field } from 'redux-form';
import categories from '../../categories';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import SubmitButton from '../shared/form/SubmitButton';
import Typography from '@material-ui/core/Typography';
import UserContract from '../../contracts/User.json';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components/macro';
import { transition } from '../shared/helpers';

const {
  fileToTypedArray,
  clearDataTransfer,
  isIpfsHash,
  formatBytes,
  stringToIpfsBuffer
} = require('./util');

const services = require('../../services');

const postTypes = [
  {
    label: 'link',
    value: 'link'
  },
  {
    label: 'text',
    value: 'text'
  },
  {
    label: 'upload',
    value: 'upload'
  }
];

const StyledQuill = styled(ReactQuill)`
  ${transition('border', 'box-shadow')};

  --border: ${props => (props.error ? props.theme.error : props.theme.accent)};
  --shadow: ${props =>
    props.error ? props.theme.error + '4d' : props.theme.accent + '4d'};

  display: block;
  ${props =>
    props.error
      ? `
    border: 1px solid var(--border)
    `
      : `
    border: 1px solid ${props.theme.border}
  `};
  border-radius: 3px;
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.inputBackground};
  font-size: 15px;
  color: ${props => props.theme.normalText};
  appearance: none;
  outline: none;
  resize: vertical;
  overflow-y: scroll;
  margin-bottom: 15px;
  :hover,
  :focus {
    border: 1px solid var(--border);
  }

  :focus {
    box-shadow: 0 0 0 2px var(--shadow);
  }
`;

class CreatePostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      isPreviewing: false,
      snackBarOpen: false,
      uploadIpfsHash: null,
      uploadLoading: false,
      errorMessage: null,
      value: 'text',
      loading: false,
      text: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  renderQuill = ({ input }) => {
    return (
      <StyledQuill
        {...input}
        onChange={(newValue, delta, source) => {
          if (source === 'user') {
            input.onChange(newValue);
          }
        }}
        onBlur={(range, source, quill) => {
          input.onBlur(quill.getHTML());
        }}
      />
    );
  };

  onSubmit = () => this.handlePublish();

  handleUploadDragEnter = e => {
    e.preventDefault();
    this.setState({ isDragging: true });
  };

  handleUploadDragOver = e => {
    e.preventDefault();
  };

  handleUploadDragLeave = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ isDragging: false });
  };

  handleUploadDrop = async e => {
    e.preventDefault();

    this.setState({
      isDragging: false,
      isPreviewing: true
      // upload: 'loading:Uploading'
    });

    const { dataTransfer } = e;
    const file = dataTransfer.items[0].getAsFile();
    await this.handleIpfsFile(file);
    clearDataTransfer(dataTransfer);
  };

  handleIpfsFile = async file => {
    this.setState({
      uploadLoading: true
    });
    const typedArray = await fileToTypedArray(file);
    const ipfsHash = await services.ipfs.uploadTypedArray(typedArray);
    this.setState({
      isDragging: false,
      isPreviewing: true,
      uploadLoading: false,
      uploadSuccess: true,
      uploadIpfsHash: ipfsHash
    });
  };

  handleChange(value) {
    this.setState({ text: value });
  }

  blockRegularTypingInUploadInput = ({ target }) => {
    target.innerHTML = dangerouslySetUploadMessage;
  };

  cancelPostPreview = () => {
    this.setState({ isPreviewing: false });
  };

  handlePublish = async () => {
    console.log('publish');
    console.log(this.props.form);
    this.setState({
      loading: true
    });
    let { title, type, upload, link, text } = this.props.form.values;
    console.log(type)
    console.log(title)
    if (type === 'text') {
      if (title && text) {
        let postObject = { type: type, title: title, post: text };
        console.log(postObject);
        const ipfsHash = await services.ipfs.uploadObject(postObject);
        const bs58 = require('bs58');
        const base58 =
          '0x' +
          bs58
            .decode(ipfsHash)
            .slice(2)
            .toString('hex');
        console.log(ipfsHash);
        console.log(base58);
        this.submitPostTransaction(base58);
      }
    }

    if (type === 'link') {
      console.log("link")
      if (title && link) {
        let postObject = { type: type, title: title, post: link };
        console.log(postObject);
        const ipfsHash = await services.ipfs.uploadObject(postObject);
        const bs58 = require('bs58');
        const base58 =
          '0x' +
          bs58
            .decode(ipfsHash)
            .slice(2)
            .toString('hex');
        this.submitPostTransaction(base58);
      }
    }

    if (type === 'upload') {
      if (title && upload) {
        let postObject = { type: type, title: title, post: upload };
        console.log(postObject);
        const ipfsHash = await services.ipfs.uploadObject(postObject);
        const bs58 = require('bs58');
        const base58 =
          '0x' +
          bs58
            .decode(ipfsHash)
            .slice(2)
            .toString('hex');
        this.submitPostTransaction(base58);
      }
    }
  };

  submitPostTransaction = ipfsHash => {
    const contract = require('truffle-contract');
    const user = contract(UserContract);
    user.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      user.at(this.props.userAddress).then(instance => {
        instance
          .createPost(this.props.forumAddress, ipfsHash, {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(result => {
            this.setState({
              loading: false
            });
          })
          .catch(function(e) {
            console.log('error');
            this.setState({
              loading: false
            });
          });
      });
    });
  };

  mapCategories = () =>
    categories.map((category, index) => (
      <option key={index} value={category}>
        {category}
      </option>
    ));

  render() {
    const { classes, address, profile } = this.props;
    const {
      isDragging,
      isPreviewing,
      comment,
      title,
      link,
      uploadIpfsHash
    } = this.state;
    return (
      <Form
        loading={this.state.uploadLoading || this.state.loading}
        onSubmit={this.props.handleSubmit(this.handlePublish)}
        wide
      >
        <Field
          name='type'
          label='type'
          type='radiogroup'
          component={renderField}
          options={postTypes}
        />
        <Field name='title' label='title' type='text' component={renderField} />
        {this.props.form.values.type === 'link' && (
          <Field name='link' label='link' type='url' component={renderField} />
        )}
        {this.props.form.values.type === 'text' && (
          <Field
            name='text'
            label='text'
            type='textarea'
            component={this.renderQuill}
          />
        )}
        {this.props.form.values.type === 'upload' &&
          !this.state.uploadLoading &&
          !this.state.uploadIpfsHash && (
            <Typography
              className={classnames(
                classes.upload,
                !isDragging && classes.uploadNotDragging,
                isDragging && classes.uploadDragging
              )}
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
          )}
        {this.props.form.values.type === 'upload' &&
          !this.state.uploadLoading &&
          this.state.uploadIpfsHash && (
            <Field
              name='upload'
              label='Upload IPFS Hash'
              type='upload'
              initialValue={this.state.uploadIpfsHash}
              component={renderField}
            />
          )}
        <SubmitButton type='submit'>create post</SubmitButton>
      </Form>
    );
  }
}

const dangerouslySetUploadMessage = 'Drop an image or video';

CreatePostForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const enhance = compose(withStyles(styles));

export default enhance(CreatePostForm);
