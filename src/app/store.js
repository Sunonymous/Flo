import { configureStore } from "@reduxjs/toolkit";
import callStateReducer from "../features/callState/callStateSlice";
import configReducer from "../features/config/configSlice";
import statsReducer from "../features/stats/statsSlice";

export default configureStore({
    reducer: {
        callState: callStateReducer,
        config:    configReducer,
        stats:     statsReducer,
    },
});