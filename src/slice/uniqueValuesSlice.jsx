// src/uniqueValuesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../components/Constant";

// Async thunk to fetch unique values
export const fetchUniqueValues = createAsyncThunk(
    "uniqueValues/fetchUniqueValues",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/api/fetch-unique-values`);
            if (!response.ok) throw new Error("Failed to fetch unique values");
            const result = await response.json();
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const uniqueValuesSlice = createSlice({
    name: "uniqueValues",
    initialState: {
        data: {},
        loading: false,
        error: null,
    },
    reducers: {}, // You can add synchronous reducers here if needed
    extraReducers: (builder) => {
        builder
            .addCase(fetchUniqueValues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUniqueValues.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchUniqueValues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default uniqueValuesSlice.reducer;
