// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import uniqueValuesReducer from "./slice/uniqueValuesSlice";
import mergedDataReducer from "./slice/mergedDataSlice";
import uniqueUpdateValuesReducer from "./slice/uniqueUpdateValuesSlice";

const store = configureStore({
    reducer: {
        uniqueValues: uniqueValuesReducer,
        mergedData: mergedDataReducer,
        uniqueUpdateValues: uniqueUpdateValuesReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Disable serializable state check for large data
            serializableCheck: false,
            immutableCheck: false,
        }),
});

export default store;
