import React from 'react';
import timeFormatter from './lib/formatTime';
import { useSelector } from 'react-redux';
import { selectConfig } from './features/config/configSlice';
import builtClass from './lib/builtClass';

const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

export const calculateTimeDifference = (startTime) => {
    const now = Date.now();
    const elapsedMS = now - startTime;
    const elapsedSeconds = Math.round(elapsedMS / MS_IN_SECOND);
    return elapsedSeconds;
};

export default function Timer({ startTime }) {
    const config = useSelector(selectConfig);
    const [secondsTracked, setSecondsTracked] = React.useState(0);
    
    // the lifetime of this component is tracked here
    React.useEffect(() => {
        let interval = setInterval(() => {
            setSecondsTracked(calculateTimeDifference(startTime));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    // if timer reaches alert interval, add a special animation
    const atAlertInterval = (secondsTracked % (config.alertInterval * SECONDS_IN_MINUTE) === 0);
    const timerTextClass = builtClass(['timeDigits',
        'noselect',
        [atAlertInterval, 'intervalAlert']]);
        
    return (
        <p className={timerTextClass}>{timeFormatter.clock(secondsTracked)}</p>
    );
}

