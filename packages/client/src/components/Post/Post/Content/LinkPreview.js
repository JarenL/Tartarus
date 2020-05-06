import styled from 'styled-components/macro';
import { overflow } from '../../../shared/helpers';

const LinkPreview = styled.div`
  ${overflow};
  cursor: pointer;
  max-width: 800px;
  font-size: 13px;
  line-height: 19px;
  color: ${props => props.theme.mutedText};

  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

export default LinkPreview;
