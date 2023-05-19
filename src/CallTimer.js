import './CallTimer.css';
import React, { useState, useEffect } from 'react';

const SECONDS_IN_MINUTE = 60;

// integer -> string
const prefixWithZero = (n) => n < 10 ? '0' + n : String(n);

// integer -> string
function formatTime(seconds) {
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    return minutes > 0 ? 
           `${minutes}:${prefixWithZero(seconds % SECONDS_IN_MINUTE)}`
         : `${seconds}`;
}

const Timer = ({ resetter }) => {
  const   [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const resetTimer = () => {
    setSeconds(0);
    setIsActive(true);
  }
  resetter.on('newCall', resetTimer);

  const timerToggle = () => setIsActive(!isActive)

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds(seconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, seconds]);

  // timer toggle keybinding
  React.useEffect(() => {
    const toggle = (e) => {
      if (e.key.toLowerCase() === "t") timerToggle();
    };
    document.addEventListener("keyup", toggle);

    return () => document.removeEventListener("keyup", toggle);
  });

  return (
    <div>
      <button className='timerToggle noselect' onClick={timerToggle}>
        {isActive ? ' \u23F8' : '\u23F5'}
      </button>
      <p className='timeDigits noselect' >
        {formatTime(seconds)}
      </p>
    </div>
  );
};

export default Timer;