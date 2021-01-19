import styled from 'styled-components/macro';
import { overflow } from '../../../shared/helpers';

const TextPreview = styled.div`
  ${overflow};
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  color: ${props => props.theme.mutedText};
  font-size: 12px;

  * {
    ${overflow};
    display: block;

    font-size: 12px;
    max-height: 20px;
    padding-bottom: 1px;
    line-height: 18px;
    font-weight: 500;
    text-decoration: none;
  }
`;

export default TextPreview;
