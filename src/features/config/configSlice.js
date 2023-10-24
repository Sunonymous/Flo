import { createSlice } from "@reduxjs/toolkit";
import defaultConfig from "../../data/defaultConfig";

const loadConfig = () => {
    // if local storage has data saved, use that first
    // apparently try/catch is needed here
    try {
        const userData = localStorage.getItem('userData'); if (userData) {
            console.log('Loading user data.');
            return JSON.parse(userData);
        } else {
            console.log('Loading default data.');
            return defaultConfig;
        }

    } catch (err) {
        console.log('Error loading user data. Loading default data.');
        return defaultConfig;
    }
};

export const configSlice = createSlice({
    name: 'config',
    initialState: loadConfig(),
    reducers: {
        setAlertInterval:  (state, action) => {
            state.alertInterval  = action.payload;
        },
        setEditBehavior:   (state, action) => {
            state.editBehavior   = action.payload;
        },
        setBehaviorString: (state, action) => {
            state.behaviorString = action.payload;
        },
    }});

export const { setAlertInterval, startTimer, setEditBehavior, setBehaviorString } = configSlice.actions;

export const selectConfig = (state) => state.config;

export default configSlice.reducer;