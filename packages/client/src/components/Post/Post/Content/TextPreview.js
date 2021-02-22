import styled from 'styled-components/macro';
import { overflow } from '../../../shared/helpers';

const TextPreview = styled.div`
  ${overflow};
  display: flex;
  white-space: nowrap;
  overflow: hidden;

  * {
    ${overflow};
    display: block;

    font-size: 12px;
    max-height: 20px;
    padding-bottom: 1px;
    line-height: 18px;
    font-weight: 500;
    text-decoration: none;
    color: ${props => props.theme.mutedText};
  }
`;

export default TextPreview;
