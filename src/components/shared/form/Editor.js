import React from 'react';
import styled from 'styled-components/macro';
import { transition } from '../helpers';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const StyledQuill = styled(ReactQuill)`
  ${transition('border', 'box-shadow')};

  --border: ${props => (props.error ? props.theme.error : props.theme.accent)};
  --shadow: ${props =>
    props.error ? props.theme.error + '4d' : props.theme.accent + '4d'};

  display: block;
  border-radius: 3px;
  width: 100%;
  height: 150px;
  background-color: ${props => props.theme.inputBackground};
  font-size: 16px;
  color: ${props => props.theme.normalText};
  appearance: none;
  outline: none;
  resize: vertical;
  overflow-y: scroll;
  :hover,
  :focus {
    border: 1px solid var(--border);
  }

  :focus {
    box-shadow: 0 0 0 2px var(--shadow);
  }
`;

const Editor = ({ input }) => {
  return (
    <StyledQuill
      {...input}
      onChange={(newValue, delta, source) => {
        if (source === 'user') {
          input.onChange(newValue);
        }
      }}
      onBlur={(range, source, quill) => {
        input.onBlur(quill.getHTML());
      }}
    />
  );
};

export default Editor;