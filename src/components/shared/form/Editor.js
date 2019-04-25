import React from 'react';
import styled from 'styled-components/macro';
import { transition } from '../helpers';
import ReactQuill from 'react-quill';

const StyledQuill = styled(ReactQuill)`
  display: block;
  border-radius: 3px;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.inputBackground};
  font-size: 16px;
  color: ${props => props.theme.mutedText};

  .ql-editor {
    height: 140px;
    resize: vertical;
    overflow-y: scroll;
  }

  .ql-toolbar {
    display: block;
    background: ${props => props.theme.toolbar};
  }

  .quill-editor .ql-toolbar {
    position: fixed;
    z-index: 100;
    top: 0;
  }
`;

const Editor = ({ input }) => {
  return (
    <StyledQuill
      {...input}
      // theme={'snow'}
      modules={Editor.modules}
      formats={Editor.formats}
      bounds={'self'}
      placeholder={'comment...'}
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

Editor.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
};

Editor.formats = [
  'header',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link'
];

export default Editor;