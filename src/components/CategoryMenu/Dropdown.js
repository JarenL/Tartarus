import React from 'react';
import styled from 'styled-components/macro';
import categories from '../../categories';
import SelectWrapper from '../shared/form/SelectWrapper';
import { transition } from '../shared/helpers';

const Dropdown = styled.select`
  ${transition('border', 'box-shadow')};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  width: 100%;
  padding: 8px 16px;
  background-color: ${props => props.theme.inputBackground};
  font-size: 12px;
  color: ${props => props.theme.normalText};
  appearance: none;
  @media (hover: hover) {
    :hover {
      border: 1px solid ${props => props.theme.accent};
    }
  }
  // @media (max-width: 768px) {
  //   margin-top: -1px;
  //   border-radius: 0;
  //   border-left: none;
  //   border-right: none;
  //   :hover,
  //   :focus-within {
  //     border-left: none;
  //     border-right: none;
  //   }
  // }
`;

class CategoryMenuDropdown extends React.Component {
  mapCategories = () =>
    this.props.subscriptions.map((subscription, index) => {
      if (subscription === 'all') {
        return (
          <option key={index} value={subscription}>
            {subscription}
          </option>
        );
      } else {
        return (
          <option key={index} value={subscription.forumName}>
            {subscription.forumName}
          </option>
        );
      }
    });

  handleOnChange = event => {
    const category = event.target.value;
    if (category !== this.props.category) {
      const url = category === 'all' ? '/' : `/f/${category}`;
      this.props.history.push(url);
    }
  };

  render() {
    return (
      <SelectWrapper flex>
        <Dropdown value={this.props.category} onChange={this.handleOnChange}>
          {this.mapCategories()}
        </Dropdown>
      </SelectWrapper>
    );
  }
}

export default CategoryMenuDropdown;
