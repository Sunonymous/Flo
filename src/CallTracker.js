import './CallTracker.css';
import React from 'react';
import { motion } from 'framer-motion';
import Behavior from './Behavior';
import Timer from './Timer';
import { BsCheck2, BsStopwatch, BsTrash } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { selectConfig } from './features/config/configSlice';
import { resetCall } from './features/callState/callStateSlice';
import { completeCall } from './features/stats/statsSlice';
import { calculateTimeDifference } from './Timer';

const splitOnLines = (s) => s.split('\n');

// sub-component for complete/discard buttons
const CallActions = ({ saveFunc }) => {
    const dispatch = useDispatch();

    const discardCall = () => {
        dispatch(resetCall());
    };
   
    const actionButtonTransition = { duration: 0.65 };

    return (
      <motion.div
        className="callActions"
        initial={{ opacity: 0, scale: 1.25 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1.25 }}
      >
        <motion.div
          layout
          transition={actionButtonTransition}
          className="action success noselect icon"
          onClick={saveFunc}
        >
          <BsCheck2 className="icon" />
        </motion.div>
        <motion.div
          layout
          transition={actionButtonTransition}
          className="btn erase noselect icon"
          onClick={discardCall}
        >
          <BsTrash className="icon" />
        </motion.div>
      </motion.div>
    );
};

export default function CallTracker({ fireworksRef }) {
    const dispatch = useDispatch();
    const config = useSelector(selectConfig);
    const [completedIDs, setCompletedIDs] = React.useState([]);
    const                     [startTime] = React.useState(Date.now());

    const saveCall = () => {
        const behaviors = splitOnLines(config.behaviorString);
        const completedBehaviors = completedIDs.map((idx) => behaviors[idx]);
        const secondsTracked = calculateTimeDifference(startTime);
        const statsObj = {behaviors: completedBehaviors, time: secondsTracked};
        dispatch(completeCall(statsObj));
        dispatch(resetCall());
    };

    return (
        <div className='trackerWrapper'>
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
                    <Timer startTime={startTime} />
                </div>)}
            {/* Call Actions */}
            {!config.editBehavior && <CallActions saveFunc={saveCall} />}
        </div>
    );
};