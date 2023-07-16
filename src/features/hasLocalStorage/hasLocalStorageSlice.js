import { createSlice } from "@reduxjs/toolkit";

const localStorageAvailable = () => {
    try {
        localStorage.getItem('userData'); // could be anything; just testing for permission
        return true;
    } catch (error) {
        return false;
    }
}

export const hasLocalStorageSlice = createSlice({
    name: 'hasLocalStorage',
    initialState: localStorageAvailable(),
    reducers: {
    }});

export const { startCall, completeCall, resetCall } = hasLocalStorageSlice.actions;

export const selectHasLocalStorage = (state) => state.hasLocalStorage;

export default hasLocalStorageSlice.reducer;