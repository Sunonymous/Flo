import React from 'react';
import './ConfigMenu.css';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { selectConfig, setAlertInterval,
         setAutostartTimer, setEditBehavior } from './configSlice';
import { ToastContext } from '../../ToastProvider';
import { selectHasLocalStorage } from '../hasLocalStorage/hasLocalStorageSlice';

const SettingsMenu = () => {
    const hasLocalStorage = useSelector(selectHasLocalStorage);
    const config   = useSelector(selectConfig);
    const dispatch = useDispatch();
    const { addToast } = React.useContext(ToastContext);
   
    const hasUserData = hasLocalStorage && !!localStorage.getItem('userData');

    // uses minutes instead of seconds
    const updateTimerInterval = (e) => {
        let newInterval = Number(e.target.value);
        if (newInterval < 1) newInterval = 1; // prevents 0 & negative numbers
        dispatch(setAlertInterval(newInterval));
    }
    
    const updateAutostartTimer = (e) => {
        const newAutostartValue = e.target.checked;
        dispatch(setAutostartTimer(newAutostartValue));
    }

    const updateEditBehavior = (e) => {
        const newEditBehaviorValue = e.target.checked;
        dispatch(setEditBehavior(newEditBehaviorValue));
    }

    return (
      <div className="settingsMenu">
        <h2>Settings</h2>
        <hr />

        <div className="section">
          <h3>Timer</h3>
          <label>No Idle Time </label>
          <input
            type="checkbox"
            checked={config.autostartTimer}
            onChange={updateAutostartTimer}
          />
          <br />

          <label htmlFor="timerAlertInterval">Alert every </label>
          <input
            id="timerAlertInterval"
            type="number"
            min={1}
            max={60}
            value={config.alertInterval}
            onChange={updateTimerInterval}
          />
          <p style={{ display: "inline-block" }}> minute(s).</p>
          <br />
        </div>

        <div className="section">
          <h3>Behavior</h3>
          <label>Edit Call Actions </label>
          <input
            type="checkbox"
            checked={config.editBehavior}
            onChange={updateEditBehavior}
          />
        </div>
        {hasUserData && (<div className='hangingAtBottom'>
          <p>Delete user data?</p>
          <div className="settingButton serious"
          onClick={() => {
            try {
              localStorage.removeItem("userData");
              addToast("notice", "User data has been deleted. Reloading page.");
              setTimeout(() => window.location.reload(), 2000); 
            } catch(error) {
              console.error('Error deleting user data: ', error);
              addToast("error", "Unable to delete user data. Error logged to the console.");
            }
          }}>
            <MdDeleteForever size={32} />
          </div>
        </div>)}
      </div>
    );
}

export default SettingsMenu;