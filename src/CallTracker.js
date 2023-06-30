import './CallTracker.css';
import React from 'react';
import Behavior from './Behavior';
import { BsCheck2, BsStopwatch, BsTrash } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { selectConfig } from './features/config/configSlice';
import { resetCall } from './features/callState/callStateSlice';
import { completeCall } from './features/stats/statsSlice';
import timeFormatter from './lib/formatTime';
import builtClass from './lib/builtClass';

const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const splitOnLines = (s) => s.split('\n');

// tracker component consolidates behavior and timer into one

export default function CallTracker({ fireworksRef }) {
    const   config = useSelector(selectConfig);
    const [secondsTracked, setSecondsTracked] = React.useState(0);
    const     [completedIDs, setCompletedIDs] = React.useState([]);
    const                         [startTime] = React.useState(Date.now());

    // the lifetime of this component is tracked here
    React.useEffect(() => {
        let interval = setInterval(() => {
            const now = Date.now();
            const elapsedMS = now - startTime;
            setSecondsTracked(Math.round(elapsedMS / MS_IN_SECOND));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    // if timer reaches alert interval, add a special animation
    const atAlertInterval = (secondsTracked % (config.alertInterval * SECONDS_IN_MINUTE) === 0);
    const timerTextClass = builtClass(['timeDigits',
        'noselect',
        [atAlertInterval, 'intervalAlert']]);

    // sub-component for complete/discard buttons
    const CallActions = () => {
        const dispatch = useDispatch();
        const saveCall = () => {
            const behaviors = splitOnLines(config.behaviorString);
            const completedBehaviors = completedIDs.map((idx) => behaviors[idx]);
            const statsObj = {behaviors: completedBehaviors, time: secondsTracked}
            dispatch(completeCall(statsObj));
            dispatch(resetCall());
        };

        const discardCall = () => {
            dispatch(resetCall());
        };

        return (
            <div className="callActions">
                <div className="action success noselect icon" onClick={saveCall}>
                    <BsCheck2 className="icon" />
                </div>
                <div className="btn erase noselect icon" onClick={discardCall}>
                    <BsTrash className="icon" />
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Tools */}
            <div className='callTools'>
                <Behavior
                    fireworksRef={fireworksRef}
                    completedIDs={completedIDs}
                    setCompletedIDs={setCompletedIDs}
                />
            </div>
            {/* Timer bits */}
            {!config.editBehavior && (
                <div>

                    <div className={"timerToggle noselect active"}>
                        <BsStopwatch />
                    </div>
                    <p className={timerTextClass}>{timeFormatter.clock(secondsTracked)}</p>
                </div>)}
            {/* Call Actions */}
            {!config.editBehavior && <CallActions />}
        </div>
    );
};