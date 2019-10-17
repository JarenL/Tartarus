import React from 'react';
import { toast } from 'react-toastify';
import Confirm from './Confirm';
import Error from './Error';
import Upload from './Upload';
import Warning from './Warning';
import 'react-toastify/dist/ReactToastify.css';

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

export const dismissToast = () => {
  toast.dismiss(toastId);
};

export const uploadToast = () => {
  toastId = toast(upload(), {
    position: 'bottom-right',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false
  });
};

export const warningToast = () => {
  if (!toast.isActive(toastId)) {
    console.log(toastId);
    toastId = toast(warning(), {
      position: 'bottom-right',
      hideProgressBar: true,
      closeOnClick: true,
      autoClose: 3000
    });
    console.log(toastId);
  } else {
    console.log(toastId);
    toast.update(toastId, {
      render: warning()
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
