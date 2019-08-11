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
    height: 110px;
    resize: vertical;
    overflow-y: scroll;
  }

  .ql-toolbar {
    display: block;
    padding: 2px;
    background: ${props => props.theme.pageBackground};
    color: ${props => props.theme.accent};
  }

  .quill-editor .ql-toolbar {
    position: fixed;
    z-index: 100;
    top: 0;
  }
`;

const Editor = props => {
  return (
    <StyledQuill
      // theme={'snow'}
      modules={Editor.modules}
      formats={Editor.formats}
      bounds={'self'}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      onChange={(newValue, delta, source) => {
        if (source === 'user') {
          props.input.onChange(newValue);
        }
      }}
      onBlur={(range, source, quill) => {
        props.input.onBlur(quill.getHTML());
      }}
    />
  );
};

Editor.modules = {
  toolbar: [
    // [{ header: '1' }],
    // ['bold', 'italic', 'underline', 'strike', 'code', 'subscript', 'blockquote'],
    // [{ list: 'ordered' }, { list: 'bullet' }],
    // ['link'],
    // ['clean']
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block', 'link'],
    [{ header: 1 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
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
  'code',
  'script',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link'
];

export default Editor;
