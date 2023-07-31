import { createSlice } from "@reduxjs/toolkit";

export const toastsSlice = createSlice({
    name: 'toasts',
    initialState: [],
    reducers: {
        popToast: (state, action) => {
            state.push(action.payload);
        },
        consumeToast: (state, action) => {
            const idToRemove = state.findIndex((toast) => toast.id === action.payload);
            if (idToRemove === -1) return; // not found!
            state.splice(idToRemove, 1);
        },
        consumeAllToasts: (state, action) => [],
    }});

export const { popToast, consumeToast, consumeAllToasts } = toastsSlice.actions;

export const selectToasts = (state) => state.toasts;

export default toastsSlice.reducer;