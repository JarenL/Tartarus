import React from 'react';
import styled from 'styled-components/macro';
import { MdFlashOn } from 'react-icons/md';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.accent};
`;

const SearchButton = () => (
  <Wrapper>
    <MdFlashOn size={25} />
  </Wrapper>
);

export default SearchButton;