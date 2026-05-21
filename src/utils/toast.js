import toast from "react-hot-toast";

export function notifySuccess(message) {
  toast.success(message);
}

export function notifyError(message) {
  toast.error(message);
}

export function notifyLoading(message) {
  return toast.loading(message);
}

export function dismissToast(id) {
  toast.dismiss(id);
}
