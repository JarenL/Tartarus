import React, { Component } from 'react';
import Form from '../../shared/form/Form';
import { transition } from '../../shared/helpers';
import styled from 'styled-components/macro';
import SearchTextArea from './SearchTextArea';
import SearchButton from './SearchButton';
import CancelButton from './CancelButton';
import { Redirect } from 'react-router';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin-right: 1.25%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(Form)`
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
  padding: 0;
  background-color: ${props => props.theme.inputBackground};
  font-size: 12px;
  color: ${props => props.theme.normalText};
  appearance: none;
  outline: none;
  resize: vertical;

  :hover,
  :focus {
    border: 1px solid var(--border);
  }

  :focus {
    box-shadow: 0 0 0 2px var(--shadow);
  }

  @media (max-width: 768px) {
    margin-top: -1px;
    border-radius: 0;
    border-left: none;
    border-right: none;
    :hover,
    :focus-within {
      border-left: none;
      border-right: none;
    }
  }
`;

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showSearch: false
    };
  }

  handleShowSearch = () => {
    this.setState({ showSearch: true });
  };

  handleSubmit = () => {
    console.log('hello');
    if (this.props.form.search.values) {
      this.props.history.push(
        `/search/${this.props.form.search.values.search}`
      );
    }
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ showSearch: false });
    this.props.reset('search');
  };

  render() {
    return (
      <Wrapper>
        {this.state.showSearch && (
          <StyledForm loading={this.state.loading}>
            <SearchTextArea name='search' onSubmit={this.handleSubmit} />
          </StyledForm>
        )}
        {this.state.showSearch ? (
          <CancelButton handleClose={this.handleClose} />
        ) : (
          <SearchButton handleShowSearch={this.handleShowSearch} />
        )}
      </Wrapper>
    );
  }
}

export default SearchBox;
