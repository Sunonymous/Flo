import './CallTimer.css';
import React from 'react';
import timeFormatter from './lib/formatTime';
import builtClass from './lib/builtClass';
import { BsStopwatch, BsStopwatchFill } from 'react-icons/bs';

const SECONDS_IN_MINUTE = 60;
const TIMED_CALL_STATES = ["talking", "paused"];

const Timer = ({ resetter, autostartTimer, alertInterval, callState, setCallState }) => {
  const [seconds, setSeconds] = React.useState(0);
  const isActive = callState === 'talking';

  // event registrations
  React.useEffect(() => {
    const resetTimer = () => {
      setSeconds(0);
      setCallState('talking');
    }
    const updateRecords = () => resetter.emit('updateCallLengths', seconds)

    resetter.on('newCall', resetTimer);
    resetter.on('completeCall', updateRecords);

    return () => {
      resetter.off('newCall', resetTimer);
      resetter.off('completeCall', updateRecords);
    }
  });

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
            {isActive ? <BsStopwatch /> : <BsStopwatchFill />}
          </button>
          <p className={timerTextClass}>{timeFormatter.clock(seconds)}</p>
        </div>
      )}
    </>
  );
};

export default Timer;