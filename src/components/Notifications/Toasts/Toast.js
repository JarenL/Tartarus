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
  toastId = toast.info(upload(), {
    position: 'bottom-right',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    transition: 'zoom'
  });
};

export const warningToast = () => {
  if (!toast.isActive(toastId)) {
    console.log(toastId)
    toastId = toast.info(warning(), {
      type: 'success',
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      transition: 'zoom'
    });
  } else {
    console.log(toastId)
    toast.update(toastId, {
      render: warning(),
      type: 'success',
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      transition: 'zoom'
    });
  }
};

export const confirmToast = () => {
  toast.update(toastId, {
    render: confirm(),
    type: 'success',
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    transition: 'zoom'
  });
};

export const errorToast = () => {
  toast.update(toastId, {
    render: error(),
    type: 'success',
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    transition: 'zoom'
  });
};
