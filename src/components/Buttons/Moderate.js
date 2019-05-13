import styled from 'styled-components/macro';
import { MdGavel } from 'react-icons/md';

const ModerateButton = styled(MdGavel)`
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

export default ModerateButton;
