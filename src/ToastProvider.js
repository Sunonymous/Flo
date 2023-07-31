import React from "react";
import useGlobalKey from "./hooks/useGlobalKey";
import { useDispatch, useSelector } from "react-redux";
import { selectToasts, popToast, consumeToast, consumeAllToasts } from "./features/toasts/toastsSlice";

export const ToastContext = React.createContext('');

function ToastProvider({ children }) {
  const    dispatch = useDispatch();
  const toastRoster = useSelector(selectToasts);

  const removeAllToasts = () => dispatch(consumeAllToasts());

  useGlobalKey('Escape', removeAllToasts);

  function addToast(type, message) {
    const id = Math.random();
    const newToast = {id, type, message};
    dispatch(popToast(newToast));
  } 

  function removeToast(idToRemove) {
    dispatch(consumeToast(idToRemove));
  }
  
  return (
  <ToastContext.Provider value={{ toasts: toastRoster, addToast, removeToast }}>
    {children}
  </ToastContext.Provider>);
}

export default ToastProvider;
