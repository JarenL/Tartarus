import React from 'react';
import { Field } from 'redux-form';
import categories from '../../categories';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import Typography from '@material-ui/core/Typography';
import UserContract from '../../contracts/User.json';
import ForumContract from '../../contracts/Forum.json';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Editor from '../shared/form/Editor';
import styled from 'styled-components/macro';
import CancelButton from '../shared/form/CancelButton';
import SubmitButton from '../shared/form/SubmitButton';

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  margin-top: 5px;
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
    console.log(ipfsHash);
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

  handleCancel = () => {
    this.props.reset('post');
  };

  handlePublish = async () => {
    console.log('publish');
    console.log(this.props.form);
    this.setState({
      loading: true
    });
    let { title, type, upload, link, text } = this.props.form.values;
    console.log(type);
    console.log(title);
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
      console.log('link');
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
      console.log('upload');
      if (title && this.state.uploadIpfsHash) {
        let postObject = {
          type: type,
          title: title,
          post: this.state.uploadIpfsHash
        };
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
    const forum = contract(ForumContract);
    user.setProvider(this.props.web3.currentProvider);
    forum.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      user.at(this.props.userAddress).then(userInstance => {
        forum.at(this.props.forumAddress).then(forumInstance => {
          forumInstance.name.call().then(forumName => {
            userInstance
              .createPost(forumName, ipfsHash, {
                from: accounts[0],
                gasPrice: 20000000000
              })
              .then(result => {
                this.setState({
                  loading: false
                });
              })
              .catch(error => {
                console.log('error');
                this.setState({
                  loading: false
                });
              });
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
          <Field name='text' label='text' type='textarea' component={Editor} />
        )}
        {this.props.form.values.type === 'upload' &&
          !this.state.uploadLoading &&
          !this.state.uploadIpfsHash && (
            <Typography
              className={classnames(
                classes.upload,
                !this.state.isDragging && classes.uploadNotDragging,
                this.state.isDragging && classes.uploadDragging
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
              label='IPFS Hash'
              type='upload'
              initialValue={this.state.uploadIpfsHash}
              component={renderField}
            />
          )}
        <Wrapper>
          <SubmitButton />
          <CancelButton onClick={this.handleCancel} />
        </Wrapper>
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
