import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sidebar from '../Home/Sidebar';
import DrawerHeader from './DrawerHeader';

const transforms = {
  top: 'translateY(-100%)',
  right: 'translateX(100%)',
  bottom: 'translateY(100%)',
  left: 'translateX(-100%)'
};
const placements = {
  top: {
    top: 0,
    right: 0,
    left: 0
  },
  right: {
    top: 0,
    right: 0,
    bottom: 0
  },
  bottom: {
    right: 0,
    bottom: 0,
    left: 0
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0
  }
};

//Styled Components
const DrawerWrapper = styled.div`
  display: block;
  width: ${props =>
    props.position !== 'top' && props.position !== 'bottom' && props.size
      ? props.size
      : '300px'};
  height: ${props =>
    (props.position === 'top' || props.position === 'bottom') && props.size
      ? props.size
      : '100%'};
  transform: ${props => (!props.open ? transforms[props.position] : null)};
`;

//Covers entire view and is used for dismissal
const DrawerOverlay = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 8;
  display: ${props => (props.open ? null : 'none')};
`;

const DrawerContent = styled.div`
  display: block;
  box-sizing: border-box;
  position: fixed;
  ${props => placements[props.position]}
  z-index: 16;
  width: ${props =>
    props.position !== 'top' && props.position !== 'bottom' && props.size
      ? props.size
      : '300px'};
  transform: ${props => (!props.open ? transforms[props.position] : null)};
  transition: transform 0.2s ease-out;
  overflow-x: hidden;
  overflow-y: scroll;
  color: #000;
  background-color: ${props => props.theme.foreground || '#fff'};
  box-shadow: -10px 0px 10px 10px rgba(0, 0, 0, 0.5);
`;

export default class Drawer extends React.Component {
  render() {
    const { open, size, position, onDismiss, backgroundColor } = this.props;

    return (
      <DrawerWrapper open={open} size={size} position={position}>
        <DrawerOverlay open={open} onClick={onDismiss} />
        <DrawerContent
          open={open}
          size={size}
          position={position}
          backgroundColor={backgroundColor}
        >
          <DrawerHeader
            username={this.props.username}
            userHex={this.props.userHex}
            handleDrawerToggle={this.props.handleDrawerToggle}
          />
          <Sidebar />
        </DrawerContent>
      </DrawerWrapper>
    );
  }
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  onDismiss: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string
};

Drawer.defaultProps = {
  size: '300px',
  position: 'left',
  backgroundColor: '#fff'
};
