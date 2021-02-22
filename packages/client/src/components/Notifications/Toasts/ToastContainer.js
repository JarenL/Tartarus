import styled from 'styled-components/macro';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress'
})`
  /* .toast-container */
  .toast {
    background-color: ${props => props.theme.foreground};
    color: ${props => props.theme.mutedText};
  }
  .progress {
    background-color: ${props => props.theme.accent};
    color: ${props => props.theme.accent};
  }
  button[aria-label='close'] {
    display: none;
  }
`;

export default StyledToastContainer;
