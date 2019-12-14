import React from 'react';
import App from './App';
import { useBoolean } from 'react-hanger';
import { ThemeProvider } from 'styled-components';
import themes from '../styles/themes';
import { useToggleBodyClass } from '../utils/hooks';
import { hot } from 'react-hot-loader/root';
import { isDev } from '../utils/dev-prod';

const Root = props => {
  const isAnimationDone = useBoolean(true);
  const night = useBoolean(true);
  // useToggleBodyClass(night, ['dark', 'light']);

  return (
    <ThemeProvider theme={themes[props.theme ? 'dark' : 'light']}>
      <App night={props.theme} isAnimationDone={isAnimationDone} noWeb3={props.noWeb3} noAccount={props.noAccount} welcomeClick={props.onClick} />
    </ThemeProvider>
  );
};

export default isDev ? hot(Root) : Root;
