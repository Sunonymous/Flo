import React from "react";
import {
  LuAlertCircle,
  LuAlertOctagon,
  LuAlertTriangle,
  LuX,
  LuSmile,
} from "react-icons/lu";

import { ToastContext } from "./ToastProvider.js";
import VisuallyHidden from "./VisuallyHidden.js";

import "./Toast.css";

const ICONS_BY_VARIANT = {
  notice:  LuAlertCircle,
  warning: LuAlertTriangle,
  success: LuSmile,
  error:   LuAlertOctagon,
};

function Toast({ id, type, message }) {
  const { removeToast } = React.useContext(ToastContext);
  const Icon = ICONS_BY_VARIANT[type];

  return (
    <div className={`toast ${type}`}>
      <div className='toastIconContainer'>
        <Icon size={24} />
      </div>
      <p className='toastContent'>
        <VisuallyHidden>{type} - </VisuallyHidden>
        {message}
      </p>
      <button
        className='toastCloseButton'
        onClick={() => removeToast(id)}
        aria-label="Dismiss message"
        aria-live="Off"
      >
        <LuX size={24} />
      </button>
    </div>
  );
}

export default Toast;
