import './CallTimer.css';
import React from 'react';
import builtClass from './lib/builtClass';

const SECONDS_IN_MINUTE = 60;
const TIMED_CALL_STATES = ["talking", "paused"];

// integer -> string
const prefixWithZero = (n) => n < 10 ? '0' + n : String(n);

// integer -> string
function formatTime(seconds) {
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    return minutes > 0 ? 
           `${minutes}:${prefixWithZero(seconds % SECONDS_IN_MINUTE)}`
         : `${seconds}`;
}

const Timer = ({ resetter, autostartTimer, alertInterval, callState, setCallState }) => {
  const [seconds, setSeconds] = React.useState(0);
  const isActive = callState === 'talking';

  const resetTimer = () => {
    setSeconds(0);
    // setIsActive(autostartTimer);
    setCallState(autostartTimer ? 'talking' : 'idle');
  }
  resetter.on('newCall', resetTimer);

  const timerToggle = () => {
    const newState = isActive ? 'paused' : 'talking';
    setCallState(newState);
  }

  React.useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds(seconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    // disabling this warning because the "missing dependency" isActive is a direct
    // result of callState. When callState changes, isActive follows
    // eslint-disable-next-line
  }, [callState, seconds]);

  // timer toggle keybinding
  React.useEffect(() => {
    const toggle = (e) => {
      if (e.key.toLowerCase() === "t") timerToggle();
    };
    document.addEventListener("keyup", toggle);

    return () => document.removeEventListener("keyup", toggle);
  });
 
  // if timer reaches alert interval, add a special animation
  const atAlertInterval = (seconds % (alertInterval * SECONDS_IN_MINUTE) === 0);
  const timerTextClass = builtClass(['timeDigits', 
                                     'noselect',
                                     [!isActive, 'blinking'],
                                     [isActive && atAlertInterval, 'intervalAlert']]);

  // Timer is only displayed in states which are actively timed.
  return (
    <>
      {TIMED_CALL_STATES.includes(callState) && (
        <div>
          <button
            className={"timerToggle noselect " + (isActive ? "active" : "")}
            onClick={timerToggle}
            onFocus={(e) => e.target.blur()}
          >
            {"\u23F1"}
          </button>
          <p className={timerTextClass}>{formatTime(seconds)}</p>
        </div>
      )}
    </>
  );
};

export default Timer;