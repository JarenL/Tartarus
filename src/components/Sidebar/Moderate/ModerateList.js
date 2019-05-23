import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import categories from './Categories';
import ModerateItem from './ModerateItem';

const List = styled.nav`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  background-color: ${props => props.theme.foreground};
`;

const Header = styled.span`
  ${wideFont};
  display: flex;
  justify-content: center;
  alignitems: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const mapCategories = categories =>
  categories.map((category, index) => {
    return <ModerateItem key={index} category={category} />;
  });

const ModerateList = props => (
  <Wrapper>
    <Header>{'Moderate'}</Header>
    <List>{mapCategories(['activity', ...categories])}</List>
  </Wrapper>
);

export default ModerateList;
