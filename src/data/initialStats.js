import defaultBehaviors from "./defaultBehaviors";

// Get some initial state going
const initialBehaviorStats = {};
defaultBehaviors.array.forEach((k) => initialBehaviorStats[k] = 0);
const initialStats = {
  totalCalls: 0,
  shortestCall: null,
  longestCall: null,
  lengthLog: [],
  behaviors: {...initialBehaviorStats},
};

export default initialStats;