import styled from 'styled-components/macro';
import { MdVerticalAlignBottom } from 'react-icons/md';

const WithdrawButton = styled(MdVerticalAlignBottom)`
  vertical-align: sub;
  cursor: pointer;
  margin-right: 2px;
  margin-left: 2px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

export default WithdrawButton;