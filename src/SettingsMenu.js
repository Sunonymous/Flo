import React from 'react';
import './SettingsMenu.css';
import { MdDeleteForever } from 'react-icons/md';

const SettingsMenu = ({ config, setConfig }) => {
    const [alertInterval, setAlertInterval] = React.useState(config.alertInterval);
    const [autostartTimer, setAutostartTimer] = React.useState(config.autostartTimer);
    // eslint-disable-next-line
    const [editBehavior, setEditBehavior] = React.useState(config.editBehavior);
    // disabling because cannot track local input state in non-local variable
   
    const hasUserData = !!localStorage.getItem('userData');

    const updateTimerInterval = (e) => {
        // uses minutes instead of seconds, and I noticed this uses implicit casting... 
        setConfig({...config, alertInterval: e.target.value });
        setAlertInterval(e.target.value);
    }
    
    const updateAutostartTimer = (e) => {
        setAutostartTimer(e.target.checked);
        setConfig({...config, autostartTimer: e.target.checked});
    }

    const updateEditBehavior = (e) => {
        setEditBehavior(e.target.checked);
        setConfig({...config, editBehavior: e.target.checked});
    }

    return (
      <div className="settingsMenu">
        <h2>Settings</h2>
        <hr />

        <div className="section">
          <h3>Timer</h3>
          <label>Start Calls Instantly </label>
          <input
            type="checkbox"
            checked={autostartTimer}
            onChange={updateAutostartTimer}
          />
          <br />

          <label htmlFor="timerAlertInterval">Alert every </label>
          <input
            id="timerAlertInterval"
            type="number"
            min={1}
            max={60}
            value={alertInterval}
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
            localStorage.removeItem('userData');
            alert('If there was any data saved, it\'s gone now!');
          }}>
            <MdDeleteForever size={32} />
          </div>
        </div>)}
      </div>
    );
}

export default SettingsMenu;