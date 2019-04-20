import styled from 'styled-components/macro';
import { overflow } from '../../shared/helpers';

const TextPreview = styled.div`
  display: flex;

  * {
    ${overflow};
    display: block;
    font-size: 12px;
    padding-bottom: 1px;
    line-height: 21px;
    font-weight: 500;
    text-decoration: none;
    color: ${props => props.theme.mutedText};
  }
`;

export default TextPreview;
