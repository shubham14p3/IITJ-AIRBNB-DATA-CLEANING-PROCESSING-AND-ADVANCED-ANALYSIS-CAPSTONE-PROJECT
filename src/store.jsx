// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import uniqueValuesReducer from "./slice/uniqueValuesSlice";
import mergedDataReducer from "./slice/mergedDataSlice";

const store = configureStore({
    reducer: {
        uniqueValues: uniqueValuesReducer,
        mergedData: mergedDataReducer,// Add the unique values slice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Disable serializable state check for large data
            serializableCheck: false,
            immutableCheck: false,
        }),
});

export default store;
