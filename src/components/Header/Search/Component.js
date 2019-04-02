import React, { Component } from 'react';
import Form from '../../shared/form/Form';
import { transition } from '../../shared/helpers';
import styled from 'styled-components/macro';
import SearchTextArea from './SearchTextArea';
import SearchButton from './SearchButton';
import CancelButton from './CancelButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(Form)`
  ${transition('border', 'box-shadow')};
  border: 1px solid ${props => props.theme.border};
  border-radius: 0 0 2px 2px;
  display: flex;
  margin-right: 5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  @media (hover: hover) {
    :hover {
      border: 1px solid ${props => props.theme.accent};
    }
  }
  :focus-within {
    border: 1px solid ${props => props.theme.accent};
    box-shadow: 0 0 0 2px ${props => props.theme.accent + '4d'};
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
    console.log(this.props.form.search.values.search);
  };

  handleCancel = () => {
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
          <CancelButton handleCancel={this.handleCancel} />
        ) : (
          <SearchButton handleShowSearch={this.handleShowSearch} />
        )}
      </Wrapper>
    );
  }
}

export default SearchBox;
