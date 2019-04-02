import styled from 'styled-components/macro';
import { overflow } from '../../shared/helpers';

const LinkPreview = styled.div`
  ${overflow};
  max-width: 800px;
  padding-bottom: 1px;
  height: 1.25em;
  font-size: 13px;
  cursor: pointer;
  color: ${props => props.theme.mutedText};

  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

export default LinkPreview;
