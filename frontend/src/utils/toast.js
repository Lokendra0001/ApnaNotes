import { ToastContainer, toast } from 'react-toastify';

const handleSuccess = (msg) => {
    toast.success(msg)
}

const handleFailure = (msg) => {
    toast.error(msg)
}

export { handleFailure, handleSuccess };

