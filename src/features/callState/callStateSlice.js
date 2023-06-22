import { createSlice } from "@reduxjs/toolkit";

export const callStateSlice = createSlice({
    name: 'callState',
    initialState: 'idle',
    reducers: {
        startCall:    (state) => 'active',
        completeCall: (state) => 'complete',
        resetCall:    (state) => 'idle',}});

export const { startCall, completeCall, resetCall } = callStateSlice.actions;

export const selectCallState = (state) => state.callState;

export default callStateSlice.reducer;