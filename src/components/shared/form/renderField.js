import React from 'react';
import InputWrapper from './InputWrapper';
import Label from './Label';
import Error from './Error';
import SelectWrapper from './SelectWrapper';
import Input from './Input';
import RadioGroup from './RadioGroup';
import styled from 'styled-components/macro';
import { transition } from '../helpers';
import Editor from './Editor';
import EditButton from '../../Sidebar/Buttons/EditButton';
import Checkbox from './Checkbox/Checkbox';

const SelectInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PermissionsInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectInput = styled.input`
  ${transition('border', 'box-shadow')};

  --border: ${props => (props.error ? props.theme.error : props.theme.accent)};
  --shadow: ${props =>
    props.error ? props.theme.error + '4d' : props.theme.accent + '4d'};

  display: block;
  ${props =>
    props.error
      ? `
    border: 1px solid var(--border)
    `
      : `
    border: 1px solid ${props.theme.border}
  `};
  border-radius: 3px;
  width: 80px;
  padding: 8px;
  background-color: ${props => props.theme.inputBackground};
  font-size: 14px;
  color: ${props => props.theme.mutedText};
  appearance: none;
  outline: none;
  resize: vertical;

  :hover,
  :focus {
    border: 1px solid var(--border);
  }

  :focus {
    box-shadow: 0 0 0 2px var(--shadow);
  }
`;

const UploadInput = styled.input`
  ${transition('border', 'box-shadow')};

  --border: ${props => (props.error ? props.theme.error : props.theme.accent)};
  --shadow: ${props =>
    props.error ? props.theme.error + '4d' : props.theme.accent + '4d'};

  display: block;
  ${props =>
    props.error
      ? `
    border: 1px solid var(--border)
    `
      : `
    border: 1px solid ${props.theme.border}
  `};
  border-radius: 3px;
  width: 100%;
  padding: 8px;
  background-color: ${props => props.theme.inputBackground};
  font-size: 15px;
  color: ${props => props.theme.normalText};
  appearance: none;
  outline: none;
  resize: none;

  :hover,
  :focus {
    border: 1px solid var(--border);
  }

  :focus {
    box-shadow: 0 0 0 2px var(--shadow);
  }
`;

const VariableField = field => {
  switch (field.type) {
    case 'select':
      return (
        <SelectInputWrapper>
          {/* <Label>{field.label}</Label>
          {field.meta.touched && field.meta.error && (
            <Error>{field.meta.error}</Error>
          )} */}
          <SelectWrapper>
            <SelectInput {...field.input} as='select' type='select'>
              {field.children}
            </SelectInput>
          </SelectWrapper>
        </SelectInputWrapper>
      );

    case 'radiogroup':
      return (
        <InputWrapper>
          <RadioGroup field={field} />
        </InputWrapper>
      );

    case 'checkbox':
      console.log(field);
      console.log('check');
      return (
        <InputWrapper>
          <Label>{field.label}</Label>
          <Checkbox checked={field.checked} onChange={field.testCheck()} />
        </InputWrapper>
      );

    case 'permissionsText':
      console.log(field)
      return (
        <PermissionsInputWrapper>
          <Label>{field.label}</Label>
          {field.meta.touched && field.meta.error && (
            <Error>{field.meta.error}</Error>
          )}
          <UploadInput
            {...field.input}
            as='textarea'
            rows='1'
            // disabled={true}
            error={field.meta.touched && !!field.meta.error}
            value={field.input}
            onChange={field.handleInput}
          />
        </PermissionsInputWrapper>
      );

    case 'textarea':
      return (
        <InputWrapper>
          <Label>{field.label}</Label>
          {field.meta.touched && field.meta.error && (
            <Error>{field.meta.error}</Error>
          )}
          <Input
            {...field.input}
            as='textarea'
            rows='6'
            error={field.meta.touched && !!field.meta.error}
            placeholder={field.label}
          />
        </InputWrapper>
      );

    case 'editor':
      console.log(field)
      return (
        <InputWrapper>
          <Label>{field.label}</Label>
          {field.meta.touched && field.meta.error && (
            <Error>{field.meta.error}</Error>
          )}
          <Editor input={field.input} placeholder={field.placeholder} defaultValue={field.defaultValue} />
        </InputWrapper>
      );

    case 'upload':
      return (
        <InputWrapper>
          <Label>{field.label}</Label>
          {field.meta.touched && field.meta.error && (
            <Error>{field.meta.error}</Error>
          )}
          <UploadInput
            {...field.input}
            as='textarea'
            rows='1'
            error={field.meta.touched && !!field.meta.error}
            value={field.initialValue}
          />
        </InputWrapper>
      );

    default:
      return (
        <InputWrapper>
          <Label>{field.label}</Label>
          {field.meta.touched && field.meta.error && (
            <Error>{field.meta.error}</Error>
          )}
          <Input
            {...field.input}
            error={field.meta.touched && !!field.meta.error}
            type={field.type}
            placeholder={field.label}
            autoComplete='off'
          />
        </InputWrapper>
      );
  }
};

const renderField = field => {
  return <VariableField {...field} />;
};

export default renderField;
