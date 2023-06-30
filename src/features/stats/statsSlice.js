import { createSlice } from "@reduxjs/toolkit";
import initialStats from "../../data/initialStats";
import { mergeAdd, frequencies } from "../../lib/statFunctions";

export const statsSlice = createSlice({
    name: 'stats',
    initialState: initialStats,
    reducers: {
        completeCall: (state, action) => {
            state.totalCalls += 1;
            // this prevents the original null from implicit casting to 0
            const originalShortest = state.shortestCall ? state.shortestCall : action.payload.time;
            state.shortestCall = Math.min(originalShortest, action.payload.time);
            state.longestCall  = Math.max(state.longestCall, action.payload.time);
            state.behaviors = mergeAdd(state.behaviors, frequencies(action.payload.behaviors));
            state.lengthLog.push(action.payload.time);
        },
    }});

export const { completeCall } = statsSlice.actions;

export const selectStats = (state) => state.stats;

export default statsSlice.reducer;