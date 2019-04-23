import styled from 'styled-components/macro';
import { MdArrowUpward } from 'react-icons/md';

const UpButton = styled(MdArrowUpward)`
  vertical-align: sub;
  margin-right: 2px;
  margin-left: 2px;
  &:last-child {
    margin-right: 0;
  }
  color: #09af00;
`;

export default UpButton;
