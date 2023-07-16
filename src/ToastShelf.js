import React from "react";
import { ToastContext } from "./ToastProvider";
import Toast from "./Toast";
import "./ToastShelf.css";

function ToastShelf() {
  const { toasts, removeToast } = React.useContext(ToastContext);

  return (
    <ol
      className='toastShelfWrapper'
      role="region"
      aria-live="assertive"
      aria-label="Notification"
    >
      {toasts.map(({ id, type, message }) => (
        <li key={id} className='individualToastWrapper'>
          <Toast
            id={id}
            type={type}
            message={message}
            removalFunction={removeToast}
          />
        </li>
      ))}
    </ol>
  );
}

export default ToastShelf;
