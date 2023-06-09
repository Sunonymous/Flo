import React from "react";
import "./StatsMenu.css";
import timeFormatter from "./lib/formatTime";
import defaultBehaviors from "./data/defaultBehaviors";

const sum = (a, b) => a + b;
const averageArray = (arr) => Math.floor(arr.reduce(sum) / arr.length);

const mergeAdd = (obj1, obj2) => {
  const result = { ...obj1 };
  Object.keys(obj2).forEach((k) => {
    if (!result[k]) {
      result[k] = 0;
    }
    result[k] += obj2[k];
    return result;
  });
  return result;
};
const frequencies = (arr) =>
  arr.reduce((acc, behavior) => {
    if (!acc[behavior]) {
      acc[behavior] = 0;
    }
    acc[behavior] += 1;
    return acc;
  }, {});

const initialBehaviorStats = {};
defaultBehaviors.array.forEach((k) => initialBehaviorStats[k] = 0);
const initialCallStats = {
  totalCalls: 0,
  shortestCall: null,
  longestCall: null,
}

const StatsMenu = ({ config, resetter }) => {
  const [behaviorStats, setBehaviorStats] = React.useState(initialBehaviorStats);
  const         [callStats, setCallStats] = React.useState(initialCallStats);
  const         [lengthLog, setLengthLog] = React.useState([]);

  const activeBehaviors = config.behaviorString.split('\n');
  const includedInActiveBehaviors = (b) => activeBehaviors.includes(b);

  React.useEffect(() => {
    const updateBehaviors = (data) =>
      setBehaviorStats(mergeAdd(behaviorStats, frequencies(data)));

    const updateCallLengths = (newTime) => {
      // this prevents the original 0 from implicit casting
      const originalShortest = callStats.shortestCall
        ? callStats.shortestCall
        : newTime;

      setCallStats({
        ...callStats,
        totalCalls: callStats.totalCalls + 1,
        shortestCall: Math.min(originalShortest, newTime),
        longestCall: Math.max(callStats.longestCall, newTime),
      });
      setLengthLog(lengthLog.concat(newTime));
    };

    resetter.on("completeCall", updateBehaviors);
    resetter.on("updateCallLengths", updateCallLengths);
    //
    return () => {
      resetter.off("completeCall", updateBehaviors);
      resetter.off("updateCallLengths", updateCallLengths);
    };
  });

  const BehaviorDisplay = (behavior, idx) => {
    return (
      <p key={`${behavior}-${idx}`} className="stat borderLeftRight">
        <span className="stat-name">{behavior}</span>
        <span>~</span>
        {/* <div className="stat-fraction">
          <span>{stats.behaviorsCompleted[behavior]}</span>
          <span>/</span>
          <span>{stats.totalCalls}</span>
        </div> */}
        <span className="stat-percent">
          {(behaviorStats[behavior] / callStats.totalCalls * 100).toFixed(0)}%
        </span>
      </p>
    );
  };

  if (callStats.totalCalls < 1) {
    return (
      <p>Save your first call to display stats!</p>
    );
  }

  return (
    <div className="statsPanel">
      <h2>Stats</h2>
      <hr />

      <div className="section borderLeftRight">
        <h3>
          <span className="totalCalls">{callStats.totalCalls} </span>
          Call{callStats.totalCalls > 1 ? "s" : ""} Completed
        </h3>
        {/* Displays differently depending on number of calls.  */}
        {callStats.totalCalls === 1 ? (
          <>
            <span>Length: {timeFormatter.words(callStats.shortestCall)}</span>
          </>
        ) : (
          <>
            <span>Shortest: {timeFormatter.words(callStats.shortestCall)}</span>
            <br />
            <span>Longest: {timeFormatter.words(callStats.longestCall)}</span>
            <br />
            <span>Average: {timeFormatter.words(averageArray(lengthLog))}</span>
            <br />
          </>
        )}
      </div>

      <div className="section">
        <h3>Behaviors</h3>
        <div>
          {Object.keys(behaviorStats)
            .filter(includedInActiveBehaviors)
            .map(BehaviorDisplay)}
          <br />
        </div>
      </div>

      <em className="tooSmall">~ Please widen browser to display stats. ~</em>
    </div>
  );
};

export default StatsMenu;
