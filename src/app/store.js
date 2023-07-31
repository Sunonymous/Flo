import { configureStore }     from "@reduxjs/toolkit";
import callStateReducer       from "../features/callState/callStateSlice";
import configReducer          from "../features/config/configSlice";
import statsReducer           from "../features/stats/statsSlice";
import reminderReducer        from "../features/reminders/remindersSlice";
import toastReducer           from "../features/toasts/toastsSlice";
import hasLocalStorageReducer from "../features/hasLocalStorage/hasLocalStorageSlice";

export default configureStore({
    reducer: {
        callState:       callStateReducer,
        config:          configReducer,
        stats:           statsReducer,
        toasts:          toastReducer,
        reminders:       reminderReducer,
        hasLocalStorage: hasLocalStorageReducer,
    },
});