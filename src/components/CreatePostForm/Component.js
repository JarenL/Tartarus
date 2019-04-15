import React from 'react';
import { Field } from 'redux-form';
import categories from '../../categories';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import Typography from '@material-ui/core/Typography';
import TartarusContract from '../../contracts/Tartarus.json';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import PropTypes from 'prop-types';
import { compose } from 'redux';
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

  componentDidMount = () => {
    console.log(this.props);
  };

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
    this.props.history.goBack();
  };

  handleSubmit = async () => {
    console.log('publish');
    console.log(this.props.form);
    this.setState({
      loading: true
    });
    const titleObject = { title: this.props.form.values.title };
    const titleIpfsHash = await services.ipfs.uploadObject(titleObject);
    const bs58 = require('bs58');
    const titleBytes32 =
      '0x' +
      bs58
        .decode(titleIpfsHash)
        .slice(2)
        .toString('hex');
    if (
      this.props.form.values.type === 'text' ||
      this.props.form.values.type === 'link'
    ) {
      if (this.props.form.values.title && this.props.form.values.post) {
        let postObject = {
          type: this.props.form.values.type,
          post: this.props.form.values.post
        };
        console.log(postObject);
        const postIpfsHash = await services.ipfs.uploadObject(postObject);
        const bs58 = require('bs58');
        const postBytes32 =
          '0x' +
          bs58
            .decode(postIpfsHash)
            .slice(2)
            .toString('hex');
        this.submitPostTransaction({ titleBytes32, postBytes32 });
      } else {
        this.setState({
          loading: false
        });
      }
    } else {
      console.log('upload');
      if (this.props.form.values.title && this.state.uploadIpfsHash) {
        let postObject = {
          type: this.props.form.values.type,
          post: this.state.uploadIpfsHash
        };
        const postIpfsHash = await services.ipfs.uploadObject(postObject);
        const bs58 = require('bs58');
        const postBytes32 =
          '0x' +
          bs58
            .decode(postIpfsHash)
            .slice(2)
            .toString('hex');
        this.submitPostTransaction({ titleBytes32, postBytes32 });
      } else {
        this.setState({
          loading: false
        });
      }
    }
  };

  submitPostTransaction = props => {
    console.log(props);
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.createPostCost.call().then(createPostCost => {
          instance
            .createPost(
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.web3.utils.fromAscii(this.props.username),
              this.props.form.createForum.values.forumName,
              props.description,
              props.rules,
              {
                from: accounts[0],
                gasPrice: 20000000000,
                value: createPostCost
              }
            )
            .then(result => {
              this.setState({
                loading: false
              });
              this.props.reset('createForum');
              this.props.history.goBack();
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
  };

  mapCategories = () =>
    categories.map((category, index) => (
      <option key={index} value={category}>
        {category}
      </option>
    ));

  render() {
    const { classes } = this.props;
    return (
      <Form
        loading={this.state.uploadLoading || this.state.loading}
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
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
          <Field name='post' label='post' type='url' component={renderField} />
        )}
        {this.props.form.values.type === 'text' && (
          <Field
            name='post'
            label='post'
            type='editor'
            component={renderField}
          />
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
              name='post'
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
