import { createSlice } from "@reduxjs/toolkit";

// reminder objects should look like:
// {
//   id:  setTimeout Interval ID (used to clear)
//   msg: string reminder message
//   at:  string of time set for reminder
//   clearID : setTimeout Interval ID for removal function
// }

export const remindersSlice = createSlice({
    name: 'reminders',
    initialState: [],
    reducers: {
        addReminder:    (state, action) => {
            state.push(action.payload);
        },
        // passed the setTimeout interval to clear
        removeReminder: (state, action) => {
            const indexToRemove = state.findIndex((rem) => rem.id === action.payload);
            state.splice(indexToRemove, 1);
        },
        changeReminder: (state, action) => {
            console.warn('unimplemented');
        },
    }});

export const { addReminder, removeReminder, changeReminder } = remindersSlice.actions;

export const selectReminders = (state) => state.reminders;

export default remindersSlice.reducer;