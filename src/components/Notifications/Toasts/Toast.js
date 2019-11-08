import React from 'react';
import { toast } from 'react-toastify';
import Confirm from './Confirm';
import Error from './Error';
import Upload from './Upload';
import Warning from './Warning';
import 'react-toastify/dist/ReactToastify.css';
import LoginSuccess from './LoginSuccess';
import LoginFail from './LoginFail';

let toastId = null;

let warning = () => {
  return <Warning />;
};

let upload = () => {
  return <Upload />;
};

let error = () => {
  return <Error />;
};

let confirm = () => {
  return <Confirm />;
};

let loginSucces = () => {
  return <LoginSuccess />
}

let loginFail = () => {
  return <LoginFail />
}

export const dismissToast = () => {
  toast.dismiss(toastId);
};

export const loginSuccessToast = () => {
  toastId = toast(loginSucces(), {
    position: 'bottom-center',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true
  });
};

export const loginFailToast = () => {
  toastId = toast(loginFail(), {
    position: 'bottom-center',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true
  });
};

export const uploadToast = () => {
  toastId = toast(upload(), {
    position: 'bottom-center',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false
  });
};

export const warningToast = () => {
  if (!toast.isActive(toastId)) {
    console.log(toastId);
    toastId = toast(warning(), {
      position: 'bottom-center',
      hideProgressBar: true,
      closeOnClick: true,
      autoClose: 3000
    });
    console.log(toastId);
  } else {
    console.log(toastId);
    toast.update(toastId, {
      render: warning(),
      closeOnClick: true,
      autoClose: 3000
    });
  }
};

export const confirmToast = () => {
  console.log(toastId);
  toast.update(toastId, {
    render: confirm()
  });
};

export const errorToast = () => {
  console.log(toastId);
  toast.update(toastId, {
    render: error()
  });
};
