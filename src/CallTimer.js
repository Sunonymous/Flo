import './CallTimer.css';
import React from 'react';
import timeFormatter from './lib/formatTime';
import builtClass from './lib/builtClass';
import { BsStopwatch } from 'react-icons/bs';

const SECONDS_IN_MINUTE = 60;
const TIMED_CALL_STATES = ["active", "paused"];

const Timer = ({ time, resetter, autostartTimer, alertInterval, callState, setCallState }) => {

  // if timer reaches alert interval, add a special animation
  const atAlertInterval = (time % (alertInterval * SECONDS_IN_MINUTE) === 0);
  const timerTextClass = builtClass(['timeDigits', 
                                     'noselect',
                                     [atAlertInterval, 'intervalAlert']]);

  // Timer is only displayed in states which are actively timed.
  return (
    <>
      {TIMED_CALL_STATES.includes(callState) && (
        <div>
          <button
            className={"timerToggle noselect active"}
          >
            <BsStopwatch />
          </button>
          <p className={timerTextClass}>{timeFormatter.clock(time)}</p>
        </div>
      )}
    </>
  );
};

export default Timer;