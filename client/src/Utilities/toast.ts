import { toast, ToastOptions } from 'react-toastify';

interface IToastParams {
  message: string;
  options?: ToastOptions;
}

export const fireToast = ({
  message,
  options = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  },
}: IToastParams) => ({
  success: () => toast.success(message, options),
  error: () => toast.error(message, options),
  warning: () => toast.warning(message, options),
  info: () => toast.info(message, options),
});
