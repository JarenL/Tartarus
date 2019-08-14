import React from 'react';
import styled from 'styled-components/macro';
import Button from '../shared/Button';

const StyledEditButton = styled(Button)`
  align-self: flex-end;
  margin: 4px;
  padding: 4px 12px;
`;

const EditButton = props => (
  <StyledEditButton>Edit</StyledEditButton>
);

export default EditButton;
