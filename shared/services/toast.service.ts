import { ReactNode } from 'react';
import { Slide, toast } from 'react-toastify';

interface IToastService {
  success: (message: string | ReactNode) => void;
  error: (message: string | ReactNode) => void;
}

export const ToastServices: IToastService = {
  success: (message) => {
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
    });
  },

  error: (message) => {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
    });
  },
};
