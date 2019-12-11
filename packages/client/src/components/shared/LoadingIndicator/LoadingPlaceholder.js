import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import styled from 'styled-components/macro';

const StyledPlaceholder = styled(ReactPlaceholder)`
  color: ${props => props.theme.accent};
`;

export default StyledPlaceholder;
