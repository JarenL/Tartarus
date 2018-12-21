import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';

export default createMuiTheme({
  palette: {
    primary: {
      light: '##90A4AE',
      main: '#607D8B',
      dark: '#455A64',
      contrastText: '#fff',
    },
    secondary: {
      light: '#E57373',
      main: '#F44336',
      dark: '#D32F2F',
      contrastText: '#fff',
    },
  },
});


 