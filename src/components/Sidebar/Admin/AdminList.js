import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import categories from './Categories';
import AdminItem from './AdminItem';

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
    return <AdminItem key={index} category={category} />;
  });

const AdminList = props => (
  <Wrapper>
    <Header>{'Admin'}</Header>
    <List>{mapCategories(['activity', ...categories])}</List>
  </Wrapper>
);

export default AdminList;
