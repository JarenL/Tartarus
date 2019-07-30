import React, { Component } from 'react';
import styled from 'styled-components/macro';

const Divider = styled.div`
  width: 100%;
  height: 12px;
  @media (max-width: 768px) {
    display: none;
  }
`;

export default Divider;
