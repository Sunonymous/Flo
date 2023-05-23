import React from 'react';
import './SettingsMenu.css';
import defaultConfig from './defaultConfig';

const SettingsMenu = ({ config, setConfig }) => {
    // alertInterval is set using seconds and configured using minutes
    // this seems uncouth 
    const startingMinutes = config.alertInterval / 60;

    const [alertInterval, setAlertInterval] = React.useState(startingMinutes);
    const [autostartTimer, setAutostartTimer] = React.useState(defaultConfig.autostartTimer);

    const updateTimerInterval = (e) => {
        // uses minutes instead of seconds
        const MIN_IN_SECONDS = 60;
        const secondsForInterval = e.target.value * MIN_IN_SECONDS;
        setConfig({...config, alertInterval: secondsForInterval });
        setAlertInterval(e.target.value);
    }
    
    const updateAutostartTimer = (e) => {
        setAutostartTimer(e.target.checked);
        setConfig({...config, autostartTimer: e.target.checked});
    }

    return (
      <>
        <h2>Settings</h2>
        <hr></hr>
        <h3>Timer</h3>
        <label>Start timer on new call? </label>
        <input
          type="checkbox"
          value={autostartTimer}
          onChange={updateAutostartTimer}
        />
        <br />

        <label htmlFor="timerAlertInveral">Alert every </label>
        <input
          id="timerAlertInterval"
          type="number"
          min={1}
          max={60}
          value={alertInterval}
          onChange={updateTimerInterval}
        />
        <p>minutes.</p>
      </>
    );
}

export default SettingsMenu;