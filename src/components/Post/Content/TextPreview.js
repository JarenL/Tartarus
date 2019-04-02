import styled from 'styled-components/macro';
import { overflow } from '../../shared/helpers';

const TextPreview = styled.div`
  ${overflow};
  max-width: 800px;
  padding-bottom: 1px;
  height: 1.25em;
  font-size: 13px;
  color: ${props => props.theme.mutedText};
`;

export default TextPreview;
