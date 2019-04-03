import styled from 'styled-components/macro';
import { MdCreate } from 'react-icons/md';

const EditButton = styled(MdCreate)`
  vertical-align: sub;
  cursor: pointer;
  align-self: flex-end;
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

export default EditButton;
