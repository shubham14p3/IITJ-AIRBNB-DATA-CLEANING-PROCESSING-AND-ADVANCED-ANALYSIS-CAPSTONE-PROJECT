// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import uniqueValuesReducer from "./slice/uniqueValuesSlice";

const store = configureStore({
    reducer: {
        uniqueValues: uniqueValuesReducer, // Add the unique values slice
    },
});

export default store;
