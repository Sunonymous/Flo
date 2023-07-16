import React from "react";
import "./StatsMenu.css";
import timeFormatter from "../../lib/formatTime";
import defaultBehaviors from "../../data/defaultBehaviors";
import { averageArray } from "../../lib/statFunctions";
import { useSelector } from "react-redux";
import { selectConfig } from "../config/configSlice";
import { selectStats } from "./statsSlice";

const initialBehaviorStats = {};
defaultBehaviors.array.forEach((k) => initialBehaviorStats[k] = 0);
export const initialCallStats = {
  totalCalls: 0,
  shortestCall: null,
  longestCall: null,
}

const StatsMenu = () => {
  const config = useSelector(selectConfig);
  const stats = useSelector(selectStats);

  const activeBehaviors = config.behaviorString.split('\n');
  const includedInActiveBehaviors = (b) => activeBehaviors.includes(b);

  const BehaviorDisplay = (behavior, idx) => {
    return (
      <p key={`${behavior}-${idx}`} className="stat borderLeftRight">
        <span className="stat-name">{behavior}</span>
        <span>~</span>
        <span className="stat-percent">
          {(stats.behaviors[behavior] / stats.totalCalls * 100).toFixed(0)}%
        </span>
      </p>
    );
  };

  if (stats.totalCalls < 1) {
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
          <span className="totalCalls">{stats.totalCalls} </span>
          Call{stats.totalCalls > 1 ? "s" : ""} Completed
        </h3>
        {/* Displays differently depending on number of calls.  */}
        {stats.totalCalls === 1 ? (
          <>
            <span>Length: {timeFormatter.words(stats.shortestCall)}</span>
          </>
        ) : (
          <>
            <span>Shortest: {timeFormatter.words(stats.shortestCall)}</span>
            <br />
            <span>Longest: {timeFormatter.words(stats.longestCall)}</span>
            <br />
            <span>Average: {timeFormatter.words(averageArray(stats.lengthLog))}</span>
            <br />
          </>
        )}
      </div>

      <div className="section">
        <h3>Behaviors</h3>
        {config.behaviorString.trim().length === 0 && <p>No behaviors are listed.</p>}
        <div>
          {Object.keys(stats.behaviors)
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
